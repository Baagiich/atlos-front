<template>
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


    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
      class="shipment-load-infos-table"
    >
      <template #item.id="{ index, item }">
          {{ index + 1 }}
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
        <p>
          {{ item.packageType.name }}
        </p>
      </template>
      <template #item.count="{ item }">
        <p>
          {{ item.count }}
        </p>
      </template>
      <template #item.weight="{ item }">
        <p>
          {{ item.weight }}
        </p>
      </template>
      <template #item.length="{ item }">
        <p>
          {{calculateCube(item)}}
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
import { useShipmentLoadInfosListStore } from "@/store/shipmentloadinfos/list";
import { useShipmentLoadInfosDeleteStore } from "@/store/shipmentloadinfos/delete";
import { useMercureList } from "@/composables/mercureList";
import type { VuetifyOrder } from "@/types/list";

const { t } = useI18n();
const route = useRoute();


const shipmentloadinfosDeleteStore = useShipmentLoadInfosDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentloadinfosDeleteStore);

const shipmentloadinfosListStore = useShipmentLoadInfosListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentloadinfosListStore);

const page = ref("1");
const order = ref({});
const itemsPerPage = ref("10");
async function sendRequest() {
  await shipmentloadinfosListStore.getItems({
    page: page.value,
    order: order.value,
    shipment: route.params.id,
    page_size: itemsPerPage.value,
    groups: ["read:ShipmentLoadInfos"],
  });
}

useMercureList({ store: shipmentloadinfosListStore, deleteStore: shipmentloadinfosDeleteStore });

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

function updatePage(newPage: string) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  order.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}
function calculateCube(item: any) {
  return item.length * item.width * item.height
}
onBeforeUnmount(() => {
  shipmentloadinfosDeleteStore.$reset();
});
</script>
<style lang="scss">
.shipment-load-infos-table {
  background: #F8F8F8;
  text-align: center;
  color: #000;
  thead{
    th{
      div{
        display: flow;
        font-weight: bold;
        text-align: center;

      }
     
    }
  }
}
</style>
