<template>
  <Toolbar
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
          :to="{ name: 'DriverImageShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.mediaobject="{ item }">
        <router-link
          v-if="router.hasRoute('MediaObjectShow')"
          :to="{
            name: 'MediaObjectShow',
            params: { id: item.image },
          }"
        >
          {{ item.image }}
        </router-link>

        <p v-else>
          {{ item.image }}
        </p>
      </template>
      <template #item.driver="{ item }">
        <router-link
          v-if="router.hasRoute('DriverShow')"
          :to="{ name: 'DriverShow', params: { id: item.driver } }"
        >
          {{ item.driver }}
        </router-link>

        <p v-else>
          {{ item.driver }}
        </p>
      </template>
      <template #item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDriverImageListStore } from "@/store/driverimage/list";
import { useDriverImageDeleteStore } from "@/store/driverimage/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/driverimage/DriverImageFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { DriverImage } from "@/types/driverimage";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverimageDeleteStore = useDriverImageDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(driverimageDeleteStore);

const driverimageListStore = useDriverImageListStore();
const { items, totalItems, error, isLoading } =
  storeToRefs(driverimageListStore);

const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});

async function sendRequest() {
  await driverimageListStore.getItems({
    page: +page.value,
    order: order.value,
    ...filters.value,
  });
}

useMercureList({
  store: driverimageListStore,
  deleteStore: driverimageDeleteStore,
});

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("driverimage.image"),
    key: "image",
    sortable: false,
  },
  {
    title: t("driverimage.driver"),
    key: "driver",
    sortable: false,
  },
  {
    title: t("driverimage.tag"),
    key: "tag",
    sortable: false,
  },
  {
    title: t("driverimage.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("driverimage.createdAt"),
    key: "createdAt",
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

function goToShowPage(item: DriverImage) {
  router.push({
    name: "DriverImageShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "DriverImageCreate",
  });
}

function goToUpdatePage(item: DriverImage) {
  router.push({
    name: "DriverImageUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: DriverImage) {
  await driverimageDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  driverimageDeleteStore.$reset();
});
</script>
