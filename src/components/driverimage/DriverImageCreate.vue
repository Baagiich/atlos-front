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
import Form from "@/components/driverimage/DriverImageForm.vue";
import { useDriverImageCreateStore } from "@/store/driverimage/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { DriverImage } from "@/types/driverimage";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverimageCreateStore = useDriverImageCreateStore();
const { created, isLoading, violations, error } = storeToRefs(
  driverimageCreateStore,
);

async function create(item: DriverImage) {
  await driverimageCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "DriverImageUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  driverimageCreateStore.$reset();
});
</script>
