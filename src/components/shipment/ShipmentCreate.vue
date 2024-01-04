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
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/shipment/ShipmentForm.vue";
import { useShipmentCreateStore } from "@/store/shipment/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Shipment } from "@/types/shipment";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentCreateStore = useShipmentCreateStore();
const { created, isLoading, violations, error } =
  storeToRefs(shipmentCreateStore);

async function create(item?: Shipment) {
  if (!item) {
    return;
  }
  await shipmentCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "ShipmentUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  shipmentCreateStore.$reset();
});
</script>
