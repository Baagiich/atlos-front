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
import Form from "@/components/vehicle/VehicleForm.vue";
import { useVehicleCreateStore } from "@/store/vehicle/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Vehicle } from "@/types/vehicle";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleCreateStore = useVehicleCreateStore();
const { created, isLoading, violations, error } = storeToRefs(vehicleCreateStore);

async function create(item: Vehicle) {
  await vehicleCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "VehicleUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  vehicleCreateStore.$reset();
});
</script>
