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


    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'ShipmentLoadInfosShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.shipment="{ item }">
        <router-link
          v-if="router.hasRoute('ShipmentShow')"
          :to="{ name: 'ShipmentShow', params: { id: item.shipment } }"
        >
          {{ item.shipment }}
        </router-link>

        <p v-else>
          {{ item.shipment }}
        </p>
      </template>
      <template #item.shipmentpackagetype="{ item }">
        <router-link
          v-if="router.hasRoute('ShipmentPackageTypeShow')"
          :to="{ name: 'ShipmentPackageTypeShow', params: { id: item.shipmentpackagetype } }"
        >
          {{ item.shipmentpackagetype }}
        </router-link>

        <p v-else>
          {{ item.shipmentpackagetype }}
        </p>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipmentLoadInfosListStore } from "@/store/shipmentloadinfos/list";
import { useShipmentLoadInfosDeleteStore } from "@/store/shipmentloadinfos/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { ShipmentLoadInfos } from "@/types/shipmentloadinfos";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadinfosDeleteStore = useShipmentLoadInfosDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentloadinfosDeleteStore);

const shipmentloadinfosListStore = useShipmentLoadInfosListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentloadinfosListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await shipmentloadinfosListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({ store: shipmentloadinfosListStore, deleteStore: shipmentloadinfosDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("shipmentloadinfos.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.count"),
    key: "count",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.length"),
    key: "length",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.width"),
    key: "width",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.height"),
    key: "height",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.weight"),
    key: "weight",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.shipment"),
    key: "shipment",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.isPileUp"),
    key: "isPileUp",
    sortable: false,
  },
  {
    title: t("shipmentloadinfos.packageType"),
    key: "packageType",
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


function goToShowPage(item: ShipmentLoadInfos) {
  router.push({
    name: "ShipmentLoadInfosShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ShipmentLoadInfosCreate",
  });
}

function goToUpdatePage(item: ShipmentLoadInfos) {
  router.push({
    name: "ShipmentLoadInfosUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: ShipmentLoadInfos) {
  await shipmentloadinfosDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  shipmentloadinfosDeleteStore.$reset();
});
</script>
