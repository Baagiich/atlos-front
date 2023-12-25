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
        <ShipmentImageSlide :items="loadPictures"></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="2" :value="2">
        <ShipmentImageSlide :items="unloadPictures"></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="3" :value="3">
        <ShipmentImageSlide :items="filePictures"></ShipmentImageSlide>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, Ref, ref } from "vue";
import { useShipmentImageListStore } from "@/store/shipmentimage/list";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { Filters } from "@/types/list";
import { ShipmentImage } from "@/types/shipmentimage";
import ShipmentDetailState from "./ShipmentState.vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
import ShipmentImageSlide from "./ShipmentImageSlide.vue";
const tab = ref(null);
const page = ref(1);
const shipmentImageListStore = useShipmentImageListStore();
const { items } = storeToRefs(shipmentImageListStore);
const route = useRoute();
const filters: Ref<Filters> = ref({});
const model = ref(null);
const loadPictures: Ref<ShipmentImage[]> = ref([]);
const unloadPictures: Ref<ShipmentImage[]> = ref([]);
const filePictures: Ref<ShipmentImage[]> = ref([]);
filters.value.shipment = decodeURIComponent(route.params.id as string);

await shipmentImageListStore.getItems({
  page: page.value,
  groups: ["shipment:detail:images"],
  ...filters.value,
});
async function classifyItem() {
  items?.value.forEach((item) => {
    if (item.tags?.includes("unload_images")) {
      unloadPictures.value.push(item);
    } else if (item.tags?.includes("load_images")) {
      loadPictures.value.push(item);
    } else if (item.tags?.includes("files")) {
      filePictures.value.push(item);
    }
  });
}
classifyItem();
</script>
