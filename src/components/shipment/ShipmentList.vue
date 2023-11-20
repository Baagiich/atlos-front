<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" closable="true">
      {{ error }}
    </v-alert>

    <DataFilter @filter="onSendFilter" @reset="resetFilter">
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
      <template #item.actions="{ item }">
        <v-btn
          color="secondary"
          size="small"
          class="ma-2"
          @click="createPriceBidding"
        >
        {{ t("shipment.sendBid") }}
        </v-btn>
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
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/shipment/ShipmentFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { Shipment } from "@/types/shipment";
import { UserType } from "@/types/usertype";
import * as apiToken from "@/utils/apiToken";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentDeleteStore = useShipmentDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentDeleteStore);

const shipmentListStore = useShipmentListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentListStore);

const page = ref("1");
const filters: Ref<Filters> = ref({});
  if(apiToken.getDecodedToken().user_type != UserType.ADMIN) {
    filters.value.state = 'created';
  }
const order = ref({});
const itemsPerPage = ref("10");
const userTypes = ref(UserType);
async function sendRequest() {
  await shipmentListStore.getItems({
    page: page.value,
    order: order.value,
    page_size: itemsPerPage.value,
    groups: ["shipment:list"],
    ...filters.value,
  });
}

useMercureList({ store: shipmentListStore, deleteStore: shipmentDeleteStore });

sendRequest();

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
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
];

function updatePage(newPage: string) {
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

function goToShowPage(item: Shipment) {
  router.push({
    name: "ShipmentShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ShipmentCreate",
  });
}

function goToUpdatePage(item: Shipment) {
  router.push({
    name: "ShipmentUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Shipment) {
  await shipmentDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  shipmentDeleteStore.$reset();
});
function createPriceBidding() {
  emit("update");
}
</script>
