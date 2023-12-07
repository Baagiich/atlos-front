<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

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
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link :to="{ name: 'VehicleShow', params: { id: item['@id'] } }">
          {{ item["@id"] }}
        </router-link>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVehicleListStore } from "@/store/vehicle/list";
import { useVehicleDeleteStore } from "@/store/vehicle/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/vehicle/VehicleFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { Vehicle } from "@/types/vehicle";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const itemsPerPage = ref("10");

const vehicleDeleteStore = useVehicleDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(vehicleDeleteStore);

const vehicleListStore = useVehicleListStore();
const { items, totalItems, error, isLoading } = storeToRefs(vehicleListStore);

const page = ref("1");
const filters: Ref<Filters> = ref({});
const order = ref({});

async function sendRequest() {
  await vehicleListStore.getItems({
    page: page.value,
    order: order.value,
    page_size: itemsPerPage.value,
    ...filters.value,
  });
}

useMercureList({ store: vehicleListStore, deleteStore: vehicleDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("vehicle.plateNumber"),
    key: "plateNumber",
    sortable: false,
  },
  {
    title: t("vehicle.shipper"),
    key: "shipper",
    sortable: false,
  },
  {
    title: t("vehicle.vehicleType"),
    key: "vehicleType",
    sortable: false,
  },
  {
    title: t("vehicle.vehicleCapacity"),
    key: "vehicleCapacity",
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

function goToShowPage(item: Vehicle) {
  router.push({
    name: "VehicleShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "VehicleCreate",
  });
}

function goToUpdatePage(item: Vehicle) {
  router.push({
    name: "VehicleUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Vehicle) {
  await vehicleDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  vehicleDeleteStore.$reset();
});
</script>
