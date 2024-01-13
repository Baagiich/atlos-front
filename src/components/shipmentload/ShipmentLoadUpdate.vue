<template>
  <v-container fluid>
    <v-alert v-if="deleteError" type="error" class="mb-4" :closable="true">
      {{ deleteError }}
    </v-alert>

    <v-alert v-if="created" type="success" class="mb-4" :closable="true">
      {{ $t("itemCreated", [created["@id"]]) }}
    </v-alert>

    <Form
      v-if="props.item"
      :values="props.item"
      :is-update="true"
      @delete="deleteItem"
      @submit="update"
    />
  </v-container>
  <Loading :visible="deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Form from "@/components/shipmentload/ShipmentLoadForm.vue";
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import { useShipmentLoadUpdateStore } from "@/store/shipmentload/customupdate";
import { useShipmentLoadCreateStore } from "@/store/shipmentload/create";
import type { ShipmentLoad } from "@/types/shipmentload";

const { t } = useI18n();
const shipmentloadCreateStore = useShipmentLoadCreateStore();
const { created } = storeToRefs(shipmentloadCreateStore);

const shipmentloadDeleteStore = useShipmentLoadDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  shipmentloadDeleteStore,
);
const props = defineProps<{
  item?: ShipmentLoad;
}>();
const shipmentloadUpdateStore = useShipmentLoadUpdateStore();

async function update(item: ShipmentLoad) {
  await shipmentloadUpdateStore.update(item);
  await updateLoadList();
}

async function deleteItem() {
  if (!props.item) {
    shipmentloadUpdateStore.setError(t("itemNotFound"));
    return;
  }
  await shipmentloadDeleteStore.deleteItem(props.item);
  updateLoadList();
}
function updateLoadList() {
  emit("updatelist");
  shipmentloadCreateStore.$reset();
}
const emit = defineEmits<{
  (e: "updatelist"): void;
}>();

onBeforeUnmount(() => {
  shipmentloadCreateStore.$reset();
});
</script>
