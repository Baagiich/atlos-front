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
          :to="{ name: 'AdminUserShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
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
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAdminUserListStore } from "@/store/adminuser/list";
import { useAdminUserDeleteStore } from "@/store/adminuser/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { AdminUser } from "@/types/adminuser";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const adminuserDeleteStore = useAdminUserDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(adminuserDeleteStore);

const adminuserListStore = useAdminUserListStore();
const { items, totalItems, error, isLoading } = storeToRefs(adminuserListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await adminuserListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({ store: adminuserListStore, deleteStore: adminuserDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("adminuser.firstName"),
    key: "firstName",
    sortable: false,
  },
  {
    title: t("adminuser.lastName"),
    key: "lastName",
    sortable: false,
  },
  {
    title: t("adminuser.userType"),
    key: "userType",
    sortable: false,
  },
  {
    title: t("adminuser.roles"),
    key: "roles",
    sortable: false,
  },
  {
    title: t("adminuser.email"),
    key: "email",
    sortable: false,
  },
  {
    title: t("adminuser.phoneNumber"),
    key: "phoneNumber",
    sortable: false,
  },
  {
    title: t("adminuser.plainPassword"),
    key: "plainPassword",
    sortable: false,
  },
  {
    title: t("adminuser.status"),
    key: "status",
    sortable: false,
  },
  {
    title: t("adminuser.verified"),
    key: "verified",
    sortable: false,
  },
  {
    title: t("adminuser.driver"),
    key: "driver",
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


function goToShowPage(item: AdminUser) {
  router.push({
    name: "AdminUserShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "AdminUserCreate",
  });
}

function goToUpdatePage(item: AdminUser) {
  router.push({
    name: "AdminUserUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: AdminUser) {
  await adminuserDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  adminuserDeleteStore.$reset();
});
</script>
