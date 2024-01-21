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
      <template #item.segment="{ item }">
        {{ item.segment?.toUpperCase() }}
      </template>
      <template #item.status="{ item }">
        <v-chip v-if="item?.status == NotificationStatus.SENT" color="green">{{
          $t("notification.sentTitle")
        }}</v-chip>
        <v-chip v-else-if="item?.status == NotificationStatus.CREATED">{{
          $t("notification.createdTitle")
        }}</v-chip>
        <v-chip v-else color="red">{{ $t("notification.failTitle") }}</v-chip>
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationOrderListStore } from "@/store/notificationorder/list";
import { useNotificationOrderDeleteStore } from "@/store/notificationorder/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { NotificationOrder } from "@/types/notificationorder";
import { NotificationStatus } from "@/types/notification_status";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const listStore = useNotificationOrderListStore();
const deleteStore = useNotificationOrderDeleteStore();
const { items, totalItems, error, isLoading } = storeToRefs(listStore);
const { deleted } = storeToRefs(deleteStore);

const page = ref(1);
const order = ref({});

async function sendRequest() {
  await listStore.getItems({
    page: +page.value,
    order: order.value,
  });
}

sendRequest();

const headers = [
  { title: "#", key: "id" },
  {
    title: t("notification.title"),
    key: "title",
    sortable: false,
  },
  {
    title: t("description"),
    key: "description",
    sortable: false,
  },
  {
    title: t("notification.segment"),
    key: "segment",
    sortable: false,
  },
  {
    title: t("status"),
    key: "status",
    sortable: false,
  },
  {
    title: t("notification.createdDate"),
    key: "createdAt",
    sortable: true,
  },
  {
    title: t("notification.sentDate"),
    key: "sentAt",
    sortable: true,
  },
  {
    title: t("actions"),
    key: "actions",
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

function goToShowPage(item: NotificationOrder) {
  router.push({
    name: "NotificationOrderShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "NotificationOrderCreate",
  });
}

function goToUpdatePage(item: NotificationOrder) {
  router.push({
    name: "NotificationOrderUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: NotificationOrder) {
  await deleteStore.deleteItem(item);
  sendRequest();
}
</script>
