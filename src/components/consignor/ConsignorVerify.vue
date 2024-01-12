<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable>{{
      error
    }}</v-alert>

    <Form :errors="violations" @submit="verify" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/adminuser/AdminUserVerifyForm.vue";
import { useAdminUserCreateStore } from "@/store/adminuser/create";
import type { AdminUserVerify } from "@/types/adminuserverify";

const router = useRouter();

const adminUserCreate = useAdminUserCreateStore();
const { isLoading, violations, error, verified } = storeToRefs(adminUserCreate);
async function verify(item: AdminUserVerify) {
  await adminUserCreate.verify(item);

  if (!verified?.value) {
    return;
  }

  router.push({ name: "ConsignorLogin" });
}

onBeforeUnmount(() => {
  adminUserCreate.$reset();
});
</script>
