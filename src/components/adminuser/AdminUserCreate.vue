<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{ error }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/adminuser/AdminUserForm.vue";
import { useAdminUserCreateStore } from "@/store/adminuser/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { AdminUser } from "@/types/adminuser";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const adminuserCreateStore = useAdminUserCreateStore();
const { created, isLoading, violations, error } = storeToRefs(adminuserCreateStore);

async function create(item: AdminUser) {
  await adminuserCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "AdminUserUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  adminuserCreateStore.$reset();
});
</script>
