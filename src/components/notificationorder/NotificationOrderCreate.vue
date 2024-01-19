<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{
      error
    }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/notificationorder/NotificationOrderForm.vue";
import { useNotificationOrderCreateStore } from "@/store/notificationorder/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { NotificationOrder } from "@/types/notificationorder";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const createStore = useNotificationOrderCreateStore();
const { created, isLoading, violations, error } = storeToRefs(createStore);

async function create(item: NotificationOrder) {
  await createStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "NotificationOrderList",
  });
}
</script>
