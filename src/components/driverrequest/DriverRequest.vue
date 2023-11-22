<template>
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-text-field
        v-model="filters.email"
          :label="$t('adminuser.email')"
          type="string"
          @change="onSendFilter"
        />
      </v-col>
    </v-row>
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
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.actions="{ item }">
        <v-btn
          color="secondary"
          size="small"
          class="ma-2"
          @click="sendRequestToDriver(item)"
        >
        {{ t("driverrequest.sendRequest") }}
        </v-btn>
      </template>
      </v-data-table-server>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeUnmount, Ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { useAdminUserListStore } from "@/store/adminuser/list";
  import { useAdminUserDeleteStore } from "@/store/adminuser/delete";
  import { useMercureList } from "@/composables/mercureList";
  import { useBreadcrumb } from "@/composables/breadcrumb";
  import type { VuetifyOrder, Filters } from "@/types/list";
  import type { AdminUser } from "@/types/adminuser";
  import { useRequestsCreateStore } from "@/store/requests/create";

  
  const { t } = useI18n();
  const router = useRouter();
  const breadcrumb = useBreadcrumb();
  
  const adminuserDeleteStore = useAdminUserDeleteStore();
  const { deleted, mercureDeleted } = storeToRefs(adminuserDeleteStore);
  
  const adminuserListStore = useAdminUserListStore();
  const { items, totalItems, error, isLoading } = storeToRefs(adminuserListStore);

  const requestsCreateStore = useRequestsCreateStore();
  const { created, violations } = storeToRefs(requestsCreateStore);
  const page = ref("1");
  const filters: Ref<Filters> = ref({ email: "" });
  const order = ref({});

  async function sendRequest() {
    await adminuserListStore.getItems({
      page: page.value,
      order: order.value,
      ...(filters.value || {}),
    });
  }
  
  useMercureList({
    store: adminuserListStore,
    deleteStore: adminuserDeleteStore,
  });
  
  sendRequest();
  
  const headers = [
    {
      title: t("adminuser.firstName"),
      key: "firstName",
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

  
  onBeforeUnmount(() => {
    adminuserDeleteStore.$reset();
  });
  function sendRequestToDriver(item: AdminUser) {
  router.push({
    name: "DriverRequestDashboard",
    params: { id: item["@id"] },
  });
}
  </script>
  