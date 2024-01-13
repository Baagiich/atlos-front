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
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
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

    <v-alert v-if="error" type="error" class="mb-4" closable>
      {{ error }}
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
        <p>
          {{ item.shipmentCode }}
        </p>
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
      <template #item.loadAt="{ item }">
        {{ formatDateTime(item.loadAt) }}
      </template>
      <template #item.unloadAt="{ item }">
        {{ formatDateTime(item.unloadAt) }}
      </template>
      <template #item.state="{ item }">
        {{ item.state }}
      </template>
      <template #item.advancePaid="{ item }">
        <v-chip v-if="item.advancePaid" color="green">{{
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
        <v-chip v-else>
          {{ t("order.unpaid") }}
        </v-chip>
      </template>
      <template #item.remainingPaid="{ item }">
        <v-chip v-if="item.remainingPaid" color="green">{{
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
        <v-chip v-else>
          {{ t("order.unpaid") }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="
            userType && [UserType.DRIVER, UserType.SHIPPER].includes(userType)
          "
          color="secondary"
          size="small"
          class="ma-2"
          @click="createPriceBidding(item)"
        >
          {{ t("shipment.sendBid") }}
        </v-btn>
        <v-btn
          v-if="userType === UserType.CONSIGNOR"
          color="secondary"
          size="small"
          class="ma-2"
          @click="gotoEditPriceDashboard(item)"
        >
          {{ t("shipment.showBid") }}
        </v-btn>
        <!-- <v-btn
          v-if="userType === UserType.CONSIGNOR"
          color="secondary"
          size="small"
          class="ma-2"
          @click="gotoEditShipmentDashboard(item)"
        >
          {{ t("edit") }}
        </v-btn> -->

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

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentDeleteStore = useShipmentDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentDeleteStore);

const shipmentListStore = useShipmentListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentListStore);
const userType = apiToken.getDecodedToken()?.user_type;

const shipmentPatchStore = useShipmentPatchStore();

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
    ? ((filters.value.state = "created"),
      (atlosuserParam.value = { atlosuser: { shipper: "off" } }))
    : null;
} else if (userType == UserType.CONSIGNOR) {
  breadcrumb[0].title !== "ShipmentOwnList"
    ? ((filters.value.state = "created"),
      (atlosuserParam.value = { atlosuser: { consignor: "off" } }))
    : null;
}
async function sendRequest() {
  await shipmentListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    groups: ["shipment:list"],
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
    groups: ["shipment:list"],
    ...filterDelivered.value,
  });
}

async function checkNonReviewedShipments() {
  await getDeliveredShipments();
  if (items.value.length < 1) {
    isExistNonReviewedShipment.value = false;
    await sendRequest();
  }
}

await checkNonReviewedShipments();

const headers = [
  { title: t("id"), key: "@id" },
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

function goToCreatePage() {
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
});
function createPriceBidding(item: Shipment) {
  router.push({
    name: "DriverRequestDashboard",
    params: { id: item["@id"] },
  });
}
function gotoEditPriceDashboard(item: Shipment) {
  router.push({
    name: "EditPriceDashboard",
    params: { id: item["@id"] },
  });
}
// function gotoEditShipmentDashboard(item: Shipment) {
//   router.push({
//     name: "ShipmentUpdate",
//     params: { id: item["@id"] },
//   })
// }

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
