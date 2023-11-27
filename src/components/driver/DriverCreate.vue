<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{
      error
    }}</v-alert>

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
import Form from "@/components/driver/DriverForm.vue";
import { useDriverCreateStore } from "@/store/driver/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Driver } from "@/types/driver";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverCreateStore = useDriverCreateStore();
const { created, isLoading, violations, error } =
  storeToRefs(driverCreateStore);

async function create(item: Driver) {
  await driverCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "DriverUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  driverCreateStore.$reset();
});
</script>
