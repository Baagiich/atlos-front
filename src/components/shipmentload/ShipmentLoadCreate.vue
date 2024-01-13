<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{
      error
    }}</v-alert>
    <Form
      :created-shipment-id="props.createdShipmentId"
      :errors="violations"
      @submit="create"
    />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/shipmentload/ShipmentLoadForm.vue";
import { useShipmentLoadCreateStore } from "@/store/shipmentload/create";
import type { ShipmentLoad } from "@/types/shipmentload";

const shipmentloadCreateStore = useShipmentLoadCreateStore();
const { created, isLoading, violations, error } = storeToRefs(
  shipmentloadCreateStore,
);
const props = defineProps(["createdShipmentId"]);
async function create(item: ShipmentLoad) {
  await shipmentloadCreateStore.create(item);

  if (!created?.value) {
    return;
  }
  updateLoadList();
}
const emit = defineEmits<{
  (e: "updatelist"): void;
}>();

function updateLoadList() {
  emit("updatelist");
  shipmentloadCreateStore.$reset();
}
onBeforeUnmount(() => {
  shipmentloadCreateStore.$reset();
});
</script>
