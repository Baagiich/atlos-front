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
import Form from "@/components/vehicleimage/VehicleImageForm.vue";
import { useVehicleImageCreateStore } from "@/store/vehicleimage/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VehicleImage } from "@/types/vehicleimage";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleimageCreateStore = useVehicleImageCreateStore();
const { created, isLoading, violations, error } = storeToRefs(vehicleimageCreateStore);

async function create(item: VehicleImage) {
  await vehicleimageCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "VehicleImageUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  vehicleimageCreateStore.$reset();
});
</script>
