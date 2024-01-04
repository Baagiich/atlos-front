<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      :closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      :closable="true"
    >
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/adminuser/AdminUserForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useAdminUserDeleteStore } from "@/store/adminuser/delete";
import { useAdminUserUpdateStore } from "@/store/adminuser/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useAdminUserCreateStore } from "@/store/adminuser/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { AdminUser } from "@/types/adminuser";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const adminuserCreateStore = useAdminUserCreateStore();
const { created } = storeToRefs(adminuserCreateStore);

const adminuserDeleteStore = useAdminUserDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(adminuserDeleteStore);

const adminuserUpdateStore = useAdminUserUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(adminuserUpdateStore);

useMercureItem({
  store: adminuserUpdateStore,
  deleteStore: adminuserDeleteStore,
  redirectRouteName: "AdminUserList",
});

await adminuserUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: AdminUser) {
  await adminuserUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    adminuserUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await adminuserDeleteStore.deleteItem(item?.value);

  router.push({ name: "AdminUserList" });
}

onBeforeUnmount(() => {
  adminuserUpdateStore.$reset();
  adminuserCreateStore.$reset();
  adminuserDeleteStore.$reset();
});
</script>
