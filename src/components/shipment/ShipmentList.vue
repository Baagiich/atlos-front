<template>
  <v-alert
    v-if="isExistNonReviewedShipment"
    type="warning"
    class="mb-4"
    :closable="false"
  >
    {{ $t("shipment.nonReviewedAlertMsg") }}
  </v-alert>
  <Toolbar
    v-else
    :actions="userType === UserType.CONSIGNOR ? ['add'] : []"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading || isLoadingCheckLimit"
    @add="goToCreatePage"
  />

  <ReviewRateDialog
    :shipment="selectedShipment"
    :show="isShowReviewDialog"
    @cancel="hideReviewDialog"
    @confirm="onConfirmReview"
  ></ReviewRateDialog>

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable>
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable>
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error || errorCheckLimit" type="error" class="mb-4" closable>
      {{ error || errorCheckLimit }}
    </v-alert>

    <DataFilter
      v-if="!isExistNonReviewedShipment"
      @filter="onSendFilter"
      @reset="resetFilter"
    >
      <template #filter>
        <Filter :values="filters" />
      </template>
    </DataFilter>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="itemsPerPage"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.@id="{ item }">
        <b>
          {{ item.shipmentCode?.toLocaleUpperCase() }}
        </b>
      </template>
      <template #item.name="{ item }">
        <p>
          {{ item.name }}
        </p>
      </template>
      <template #item.shipmentType="{ item }">
        <v-chip v-if="item.shipmentType == ShipmentType.REGULAR" size="small">
          {{ $t("shipmentload.regularShipment") }}
        </v-chip>
        <v-chip
          v-else-if="item.shipmentType == ShipmentType.SECURE"
          color="info"
          size="small"
          >{{ $t("shipmentload.secureShipment") }}</v-chip
        >
        <v-chip v-else size="small">{{ item.shipmentType }}</v-chip>
      </template>
      <template #item.fromAddress="{ item }">
        <p>
          {{ item.fromAddress.city.name }}
        </p>
      </template>
      <template #item.toAddress="{ item }">
        <p>
          {{ item.toAddress.city.name }}
        </p>
      </template>
      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
      <template #item.loadAt="{ item }">
        {{ formatDateTime(item.loadAt) }}
      </template>
      <template #item.unloadAt="{ item }">
        {{ formatDateTime(item.unloadAt) }}
      </template>
      <template #item.state="{ item }">
        <v-chip color="info" size="small">{{
          $t("shipment." + item.state)
        }}</v-chip>
      </template>
      <template #item.advancePaid="{ item }">
        <v-chip v-if="item.advancePaid" color="green" size="small">{{
          $t("order.paid")
        }}</v-chip>
        <v-btn
          v-else-if="item.advanceOrderNumber"
          color="success"
          size="small"
          class="ma-2"
          @click="goToCheckoutPage(item.advanceOrderNumber)"
        >
          {{ t("order.pay") }}
        </v-btn>
        <v-chip v-else size="small">
          {{ t("order.unpaid") }}
        </v-chip>
      </template>
      <template #item.remainingPaid="{ item }">
        <v-chip v-if="item.remainingPaid" color="green" size="small">{{
          $t("order.paid")
        }}</v-chip>
        <v-btn
          v-else-if="item.remainingOrderNumber"
          color="success"
          size="small"
          class="ma-2"
          @click="goToCheckoutPage(item.remainingOrderNumber)"
        >
          {{ t("order.pay") }}
        </v-btn>
        <v-chip v-else size="small">
          {{ t("order.unpaid") }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="item.state === ShipmentStateString.DELIVERED"
          color="warning"
          size="small"
          class="ma-2"
          @click="showReviewDialog(item)"
        >
          {{ t("shipment.approveDelivery") }}
        </v-btn>

        <ActionCell :actions="['show']" @show="goToShowPage(item)" />
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipmentListStore } from "@/store/shipment/list";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentPatchStore } from "@/store/shipment/patch";
import { useAdminUserShipmentLimitStore } from "@/store/adminuser/checklimit";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/shipment/ShipmentFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { Shipment } from "@/types/shipment";
import { UserType } from "@/types/usertype";
import * as apiToken from "@/utils/apiToken";
import { ShipmentAction } from "@/types/shipmentaction";
import { ShipmentStateString } from "@/types/shipment_state";
import ReviewRateDialog from "@/components/review/ReviewRateDialog.vue";
import dayjs from "dayjs";
import { ShipmentType } from "@/types/shipment_type";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentDeleteStore = useShipmentDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentDeleteStore);

const shipmentListStore = useShipmentListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentListStore);
const userType = apiToken.getDecodedToken()?.user_type;

const shipmentPatchStore = useShipmentPatchStore();

const adminUserShipmentLimitStore = useAdminUserShipmentLimitStore();
const {
  retrieved: checkLimitResponse,
  error: errorCheckLimit,
  isLoading: isLoadingCheckLimit,
} = storeToRefs(adminUserShipmentLimitStore);

const page = ref(1);
const filters: Ref<Filters> = ref({});

const isShowReviewDialog = ref(false);
const selectedShipment: Ref<Shipment> = ref({});

const order = ref({});
const itemsPerPage = ref("10");
const isExistNonReviewedShipment = ref(true);
const atlosuserParam = ref({});
if (userType == UserType.SHIPPER) {
  breadcrumb[0].title !== "ShipmentOwnList"
    ? (((filters.value.state = "created"), (filters.value.shipmentType = "2")),
      (atlosuserParam.value = { atlosuser: { shipper: "off" } }))
    : null;
}
async function sendRequest() {
  if (filters.value.loadAt) {
    atlosuserParam.value = {
      loadAt: {
        after: dayjs(filters.value.loadAt)
          .startOf("day")
          .startOf("hour")
          .toDate(),
        before: dayjs(filters.value.loadAt).endOf("day").endOf("hour").toDate(),
      },
    };
  }
  await shipmentListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    groups: ["shipment:list", "timestamp"],
    ...filters.value,
    ...atlosuserParam.value,
  });
}

async function getDeliveredShipments() {
  const filterDelivered: Ref<Filters> = ref({});
  filterDelivered.value.state = "delivered";
  await shipmentListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    groups: ["shipment:list", "timestamp"],
    ...filterDelivered.value,
  });
}

async function checkNonReviewedShipments() {
  await getDeliveredShipments();
  if (userType == UserType.SHIPPER || items.value.length < 1) {
    isExistNonReviewedShipment.value = false;
    await sendRequest();
  }
}

await checkNonReviewedShipments();

const headers = [
  { title: t("shipment.code"), key: "@id" },
  {
    title: t("shipment.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("shipment.shipmentType"),
    key: "shipmentType",
    sortable: false,
  },
  {
    title: t("shipment.fromAddress"),
    key: "fromAddress",
    sortable: false,
  },
  {
    title: t("shipment.toAddress"),
    key: "toAddress",
    sortable: false,
  },
  {
    title: t("shipment.createdAt"),
    key: "createdAt",
    sortable: false,
  },
  {
    title: t("shipment.loadAt"),
    key: "loadAt",
    sortable: false,
  },
  {
    title: t("shipment.unloadAt"),
    key: "unloadAt",
    sortable: false,
  },
  {
    title: t("shipment.state"),
    key: "state",
    sortable: false,
  },
  {
    title: t("advance"),
    key: "advancePaid",
    sortable: false,
  },
  {
    title: t("remaining"),
    key: "remainingPaid",
    sortable: false,
  },
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
];

function updatePage(newPage: number) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  order.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}

function onSendFilter() {
  sendRequest();
}

function resetFilter() {
  filters.value = {};

  sendRequest();
}

async function goToCreatePage() {
  await adminUserShipmentLimitStore.getShipmentLimit();

  if (checkLimitResponse?.value?.isLimitExceed) {
    return;
  }
  router.push({
    name: "ShipmentLoadDashboard",
  });
}
function goToShowPage(item: Shipment) {
  router.push({
    name: "ShipmentDetail",
    params: { id: item["@id"] },
  });
}
onBeforeUnmount(() => {
  shipmentDeleteStore.$reset();
  adminUserShipmentLimitStore.$reset();
});

async function goToCheckoutPage(orderNumber: string) {
  router.push({
    name: "OrderCheckout",
    params: { orderNumber: orderNumber },
  });
}

async function showReviewDialog(shipment?: Shipment) {
  if (!shipment) {
    return;
  }
  selectedShipment.value = shipment;
  isShowReviewDialog.value = !isShowReviewDialog.value;
}

function hideReviewDialog() {
  isShowReviewDialog.value = !isShowReviewDialog.value;
}

async function onConfirmReview() {
  hideReviewDialog();
  await approveShipmentDelivery();
  selectedShipment.value = {};
}

async function approveShipmentDelivery() {
  if (!selectedShipment.value.id) {
    return;
  }
  await shipmentPatchStore.doAction(
    +selectedShipment.value.id,
    ShipmentAction.DELIVERY_TO_APPROVE,
  );
  await checkNonReviewedShipments();
}
</script>
