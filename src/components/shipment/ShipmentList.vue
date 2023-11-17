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
        <router-link
          :to="{ name: 'ShipmentShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>
      <template #item.adminuser="{ item }">
        <router-link
          v-if="router.hasRoute('AdminUserShow')"
          :to="{ name: 'AdminUserShow', params: { id: item.adminuser } }"
        >
          {{ item.adminuser }}
          
        </router-link>

        <p v-else>
          {{ item.adminuser }}
        </p>
      </template>
      <template #item.address="{ item }">
        <router-link
          v-if="router.hasRoute('AddressShow')"
          :to="{ name: 'AddressShow', params: { id: item.address } }"
        >
          {{ item.address }}
        </router-link>

        <p v-else>
          {{ item.address }}
        </p>
      </template>
      <template #item.loadAt="{ item }">
        {{ formatDateTime(item.loadAt) }}
      </template>
            <template #item.unloadAt="{ item }">
        {{ formatDateTime(item.unloadAt) }}
      </template>
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
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

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentDeleteStore = useShipmentDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentDeleteStore);

const shipmentListStore = useShipmentListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shipmentListStore);

const page = ref("1");
const filters: Ref<Filters> = ref({});
const order = ref({});
const itemsPerPage = ref("10");

async function sendRequest() {
  await shipmentListStore.getItems({
    page: page.value,
    order: order.value,
    page_size: itemsPerPage.value,
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
    title: t("shipment.createdAt"),
    key: "createdAt",
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
</script>
