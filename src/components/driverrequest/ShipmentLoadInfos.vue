<template>
  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" :closable="true">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" :closable="true">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      class="shipment-load-infos-table"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.id="{ item }">
        {{ items.indexOf(item) + 1 }}
      </template>
      <template #item.name="{ item }">
        <p>
          {{ item.name }}
        </p>
      </template>
      <template #item.shipment="{ item }">
        <p>
          {{ item.shipment }}
        </p>
      </template>
      <template #item.shipmentpackagetype="{ item }">
        <p v-if="item?.packageType">
          {{
            isString(item.packageType)
              ? item.packageType
              : item.packageType?.name
          }}
        </p>
      </template>
      <template #item.count="{ item }">
        <p>
          {{ item.quantity }}
        </p>
      </template>
      <template #item.weight="{ item }">
        <p>
          {{ item.weight }}
        </p>
      </template>
      <template #item.length="{ item }">
        <p>
          {{ calculateCube(item) }}
        </p>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipmentLoadListStore } from "@/store/shipmentload/list";
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import { useMercureList } from "@/composables/mercureList";
import type { Filters, VuetifyOrder } from "@/types/list";
import isString from "lodash/isString";
import { Ref } from "vue";

const { t } = useI18n();
const route = useRoute();

const shipmentLoadDeleteStore = useShipmentLoadDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentLoadDeleteStore);

const shipmentLoadListStore = useShipmentLoadListStore();
const { items, totalItems, error, isLoading } = storeToRefs(
  shipmentLoadListStore,
);

const page = ref(1);
const order = ref({});
const itemsPerPage = ref("10");

const filters: Ref<Filters> = ref({});

if (isString(route.params.shipmentId)) {
  filters.value.shipment = route.params.shipmentId;
}

async function sendRequest() {
  await shipmentLoadListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    ...filters.value,
  });
}

useMercureList({
  store: shipmentLoadListStore,
  deleteStore: shipmentLoadDeleteStore,
});

sendRequest();

const headers = [
  { title: t("id"), key: "id" },
  {
    title: t("shipmentloadinfos.name"),
    key: "name",
    sortable: false,
  },

  {
    title: t("shipmentloadinfos.packageType"),
    key: "shipmentpackagetype",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.count"),
    key: "count",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.weight"),
    key: "weight",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.cube"),
    key: "length",
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
function calculateCube(item: any) {
  return item.length * item.width * item.height;
}
onBeforeUnmount(() => {
  shipmentLoadDeleteStore.$reset();
});
</script>
<style lang="scss">
.shipment-load-infos-table {
  background: #f8f8f8;
  text-align: center;
  color: #000;
  thead {
    th {
      div {
        display: flow;
        font-weight: bold;
        text-align: center;
      }
    }
  }
}
</style>
