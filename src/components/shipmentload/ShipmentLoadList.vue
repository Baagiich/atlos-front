<template>
  <Toolbar
    v-if="!props.hideToolbar"
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

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
          :to="{ name: 'ShipmentLoadShow', params: { id: item['@id'] } }"
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
      <template #item.packageType="{ item }">
        <router-link
          v-if="router.hasRoute('PackageTypeShow')"
          :to="{
            name: 'PackageTypeShow',
            params: { id: isString(item.packageType) ? item.packageType : '' },
          }"
        >
          {{ item.packageType }}
        </router-link>

        <p v-else>
          {{ item.packageType }}
        </p>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipmentLoadListStore } from "@/store/shipmentload/list";
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { ShipmentLoad } from "@/types/shipmentload";
import isString from "lodash/isString";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadDeleteStore = useShipmentLoadDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shipmentloadDeleteStore);

const shipmentloadListStore = useShipmentLoadListStore();
const { items, totalItems, error, isLoading } = storeToRefs(
  shipmentloadListStore,
);
const props = defineProps<{ shipmentId?: string; hideToolbar?: boolean }>();
const shipmentId = ref(props.shipmentId);
const page = ref(1);
const filters: Ref<Filters> = ref({});

if (shipmentId.value) {
  filters.value.shipment = shipmentId.value;
}
const order = ref({});

async function sendRequest() {
  await shipmentloadListStore.getItems({
    page: +page.value,
    order: order.value,
    ...filters.value,
  });
}

useMercureList({
  store: shipmentloadListStore,
  deleteStore: shipmentloadDeleteStore,
});

sendRequest();

const headers = [
  // {
  //   title: t("actions"),
  //   key: "actions",
  //   sortable: false,
  // },
  // { title: t("id"), key: "@id" },
  {
    title: t("shipmentload.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("shipmentload.quantity"),
    key: "quantity",
    sortable: false,
  },
  {
    title: t("shipmentload.length"),
    key: "length",
    sortable: false,
  },
  {
    title: t("shipmentload.width"),
    key: "width",
    sortable: false,
  },
  {
    title: t("shipmentload.height"),
    key: "height",
    sortable: false,
  },
  {
    title: t("shipmentload.weight"),
    key: "weight",
    sortable: false,
  },
  // {
  //   title: t("shipmentload.shipment"),
  //   key: "shipment",
  //   sortable: false,
  // },
  {
    title: t("shipmentload.packageType"),
    key: "packageType",
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

function goToShowPage(item: ShipmentLoad) {
  router.push({
    name: "ShipmentLoadShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ShipmentLoadCreate",
  });
}

function goToUpdatePage(item: ShipmentLoad) {
  router.push({
    name: "ShipmentLoadUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: ShipmentLoad) {
  await shipmentloadDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  shipmentloadDeleteStore.$reset();
});
</script>
