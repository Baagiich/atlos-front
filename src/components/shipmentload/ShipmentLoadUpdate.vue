<template>
  <v-container fluid>
    <v-alert v-if="deleteError" type="error" class="mb-4" :closable="true">
      {{ deleteError }}
    </v-alert>

    <v-alert v-if="created" type="success" class="mb-4" :closable="true">
      {{ $t("itemCreated", [created["@id"]]) }}
    </v-alert>

    <Form
      v-if="item"
      :values="item"
      :is-update="true"
      @delete="deleteItem"
      @submit="update"
    />
  </v-container>
  <Loading :visible="deleteLoading" />
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Form from "@/components/shipmentload/ShipmentLoadForm.vue";
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import { useShipmentLoadUpdateStore } from "@/store/shipmentload/update";
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
const item: Ref<ShipmentLoad | undefined> = ref(props.item);
const shipmentloadUpdateStore = useShipmentLoadUpdateStore();

await shipmentloadUpdateStore.retrieve(getId());
async function update(item: ShipmentLoad) {
  await shipmentloadUpdateStore.update(item);
  emit("updatelist");
}

async function deleteItem() {
  if (!item?.value) {
    shipmentloadUpdateStore.setError(t("itemNotFound"));
    return;
  }
  await shipmentloadDeleteStore.deleteItem(item?.value);
  emit("updatelist");
}
const emit = defineEmits<{
  (e: "updatelist"): void;
}>();
function getId(): string {
  if (!item.value) {
    return "";
  }
  const iri = item.value["@id"];
  if (iri) {
    iri.replace("/api/shipment_loads/", "");
    return iri;
  }
  return "";
}
</script>
