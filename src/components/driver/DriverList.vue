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
        <router-link :to="{ name: 'DriverShow', params: { id: item['@id'] } }">
          {{ item["@id"] }}
        </router-link>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDriverListStore } from "@/store/driver/list";
import { useDriverDeleteStore } from "@/store/driver/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Driver } from "@/types/driver";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverDeleteStore = useDriverDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(driverDeleteStore);

const driverListStore = useDriverListStore();
const { items, totalItems, error, isLoading } = storeToRefs(driverListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await driverListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({ store: driverListStore, deleteStore: driverDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("driver.firstName"),
    key: "firstName",
    sortable: false,
  },
  {
    title: t("driver.lastName"),
    key: "lastName",
    sortable: false,
  },
  {
    title: t("driver.phoneNumber"),
    key: "phoneNumber",
    sortable: false,
  },
  {
    title: t("driver.email"),
    key: "email",
    sortable: false,
  },
  {
    title: t("driver.registerNumber"),
    key: "registerNumber",
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

function goToShowPage(item: Driver) {
  router.push({
    name: "DriverShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "DriverCreate",
  });
}

function goToUpdatePage(item: Driver) {
  router.push({
    name: "DriverUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Driver) {
  await driverDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  driverDeleteStore.$reset();
});
</script>
