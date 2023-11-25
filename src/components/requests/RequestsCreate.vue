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
import Form from "@/components/requests/RequestsForm.vue";
import { useRequestsCreateStore } from "@/store/requests/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Requests } from "@/types/requests";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const requestsCreateStore = useRequestsCreateStore();
const { created, isLoading, violations, error } = storeToRefs(requestsCreateStore);

async function create(item: Requests) {
  await requestsCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "RequestsUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  requestsCreateStore.$reset();
});
</script>
