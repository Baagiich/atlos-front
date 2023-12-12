<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{
      error
    }}</v-alert>

    <Form
      :createdShipmentId="createdShipmentId"
      :errors="violations"
      @submit="create"
    />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/shipmentload/ShipmentLoadForm.vue";
import { useShipmentLoadCreateStore } from "@/store/shipmentload/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipmentLoad } from "@/types/shipmentload";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadCreateStore = useShipmentLoadCreateStore();
const { created, isLoading, violations, error } = storeToRefs(
  shipmentloadCreateStore,
);
const props = defineProps(["createdShipmentId"]);
const createdShipmentId = ref(props.createdShipmentId);
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
