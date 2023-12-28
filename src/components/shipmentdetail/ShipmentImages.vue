<template>
  <ShipmentDetailState></ShipmentDetailState>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
      <v-tab :value="1">{{ $t("shipmentimage.load") }}</v-tab>
      <v-tab :value="2">{{ $t("shipmentimage.unload") }}</v-tab>
      <v-tab :value="3">{{ $t("shipmentimage.files") }}</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :key="1" :value="1">
        <ShipmentImageSlide :items="loadPictures"  @submitImg="emitUpload"></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="2" :value="2">
        <ShipmentImageSlide :items="unloadPictures"  @submitImg="emitUpload"></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="3" :value="3">
        <ShipmentImageSlide :items="filePictures" :files="true" @submitImg="emitUpload"></ShipmentImageSlide>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount, Ref, ref } from "vue";
import { useShipmentImageListStore } from "@/store/shipmentimage/list";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { Filters } from "@/types/list";
import { ShipmentImage } from "@/types/shipmentimage";
import ShipmentDetailState from "./ShipmentState.vue";
import ShipmentImageSlide from "./ShipmentImageSlide.vue";
import { useShipmentImageCreateStore } from "@/store/shipmentimage/create";

const tab = ref(null);
const page = ref(1);
const shipmentImageListStore = useShipmentImageListStore();
const { items } = storeToRefs(shipmentImageListStore);
const route = useRoute();
const filters: Ref<Filters> = ref({});
const loadPictures: Ref<ShipmentImage[]> = ref([]);
const unloadPictures: Ref<ShipmentImage[]> = ref([]);
const filePictures: Ref<ShipmentImage[]> = ref([]);
filters.value.shipment = decodeURIComponent(route.params.id as string);
const shipmentImageCreateStore = useShipmentImageCreateStore();
const { created, error, violations, isLoading } = storeToRefs(shipmentImageCreateStore);
await shipmentImageListStore.getItems({
  page: page.value,
  groups: ["shipment:detail:images"],
  ...filters.value,
});
function classifyItem() {
  unloadPictures.value = [];
  loadPictures.value = [];
  filePictures.value = [];

  items.value.forEach((item) => {
    if (item.tags?.includes("unload_images")) {
      unloadPictures.value.push(item);
    } else if (item.tags?.includes("load_images")) {
      loadPictures.value.push(item);
    } else if (item.tags?.includes("files")) {
      filePictures.value.push(item);
    } else {
      filePictures.value.push(item);
    }
  });
}
classifyItem();

async function emitUpload(shipmentImage: any) {
  await shipmentImageCreateStore.create(shipmentImage.value);

  if (!created?.value) {
    return;
  }
  await shipmentImageListStore.getItems({
  page: page.value,
  groups: ["shipment:detail:images"],
  ...filters.value,
  });

 classifyItem();
}

onBeforeUnmount(() => {
  shipmentImageCreateStore.$reset();
});
</script>
