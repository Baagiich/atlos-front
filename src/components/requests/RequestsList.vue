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
          :to="{ name: 'RequestsShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.fromUser="{ item }">
        <router-link
          v-if="router.hasRoute('AdminUserShow')"
          :to="{ name: 'AdminUserShow', params: { id: item.fromUser } }"
        >
          {{ item.fromUser }}
        </router-link>

        <p v-else>
          {{ item.fromUser }}
        </p>
      </template>
      <template #item.toUser="{ item }">
        <router-link
          v-if="router.hasRoute('AdminUserShow')"
          :to="{ name: 'AdminUserShow', params: { id: item.toUser } }"
        >
          {{ item.toUser }}
        </router-link>

        <p v-else>
          {{ item.toUser }}
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
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useRequestsListStore } from "@/store/requests/list";
import { useRequestsDeleteStore } from "@/store/requests/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Requests } from "@/types/requests";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const requestsDeleteStore = useRequestsDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(requestsDeleteStore);

const requestsListStore = useRequestsListStore();
const { items, totalItems, error, isLoading } = storeToRefs(requestsListStore);

const page = ref(1);
const order = ref({});

async function sendRequest() {
  await requestsListStore.getItems({
    page: +page.value,
    order: order.value,
  });
}

useMercureList({ store: requestsListStore, deleteStore: requestsDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("requests.fromUser"),
    key: "fromUser",
    sortable: false,
  },
  {
    title: t("requests.toUser"),
    key: "toUser",
    sortable: false,
  },
  {
    title: t("requests.code"),
    key: "code",
    sortable: false,
  },
  {
    title: t("requests.type"),
    key: "type",
    sortable: false,
  },
  {
    title: t("requests.targetEntityId"),
    key: "targetEntityId",
    sortable: false,
  },
  {
    title: t("requests.params"),
    key: "params",
    sortable: false,
  },
  {
    title: t("requests.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("requests.createdAt"),
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

function goToShowPage(item: Requests) {
  router.push({
    name: "RequestsShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "RequestsCreate",
  });
}

function goToUpdatePage(item: Requests) {
  router.push({
    name: "RequestsUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Requests) {
  await requestsDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  requestsDeleteStore.$reset();
});
</script>
