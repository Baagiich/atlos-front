<template>
  <ShipmentDetailState></ShipmentDetailState>
  <v-card-title>{{ $t("consignor.title") }}</v-card-title>
  <v-card>
    <v-tabs
      v-model="consignortab"
      color="deep-purple-accent-4"
      align-tabs="center"
    >
      <v-tab :value="consignor + '-' + 1">{{ $t("shipmentimage.load") }}</v-tab>
      <v-tab :value="consignor + '-' + 2">{{
        $t("shipmentimage.unload")
      }}</v-tab>
    </v-tabs>
    <v-window v-model="consignortab">
      <v-window-item :key="consignor + '-' + 1" :value="consignor + '-' + 1">
        <ShipmentImageSlide
          :items="consignorLoadPictures"
          :default-image-tags="ShipmentImageSectionTag.loadImages"
          :uploadable="isUserType(consignor)"
          :img-updated="imgUpdated"
          @submitImg="emitUpload"
        ></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="consignor + '-' + 2" :value="consignor + '-' + 2">
        <ShipmentImageSlide
          :items="consignorUnloadPictures"
          :default-image-tags="ShipmentImageSectionTag.unloadImages"
          :uploadable="isUserType(consignor)"
          :img-updated="imgUpdated"
          @submitImg="emitUpload"
        ></ShipmentImageSlide>
      </v-window-item>
    </v-window>
  </v-card>
  <v-card-title>{{ $t("shippercompany.title") }}</v-card-title>
  <v-card>
    <v-tabs
      v-model="shippertab"
      color="deep-purple-accent-4"
      align-tabs="center"
    >
      <v-tab :value="shipper + '-' + 1">{{ $t("shipmentimage.load") }}</v-tab>
      <v-tab :value="shipper + '-' + 2">{{ $t("shipmentimage.unload") }}</v-tab>
      <v-tab :value="shipper + '-' + 3">{{ $t("shipmentimage.files") }}</v-tab>
    </v-tabs>
    <v-window v-model="shippertab">
      <v-window-item :key="shipper + '-' + 1" :value="shipper + '-' + 1">
        <ShipmentImageSlide
          :items="shipperLoadPictures"
          :default-image-tags="ShipmentImageSectionTag.loadImages"
          :uploadable="isUserType(shipper)"
          :img-updated="imgUpdated"
          @submitImg="emitUpload"
        ></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="shipper + '-' + 2" :value="shipper + '-' + 2">
        <ShipmentImageSlide
          :items="shipperUnloadPictures"
          :default-image-tags="ShipmentImageSectionTag.unloadImages"
          :uploadable="isUserType(shipper)"
          :img-updated="imgUpdated"
          @submitImg="emitUpload"
        ></ShipmentImageSlide>
      </v-window-item>
      <v-window-item :key="shipper + '-' + 3" :value="shipper + '-' + 3">
        <ShipmentImageSlide
          :items="shipperFilePictures"
          :default-image-tags="ShipmentImageSectionTag.files"
          :uploadable="isUserType(shipper)"
          :img-updated="imgUpdated"
          :files="true"
          @submitImg="emitUpload"
          @accept-file="emitAcceptFile"
          @reject-file="emitRejectFile"
        ></ShipmentImageSlide>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, Ref, ref, computed } from "vue";
import { useShipmentImageListStore } from "@/store/shipmentimage/list";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { Filters } from "@/types/list";
import { ShipmentImage } from "@/types/shipmentimage";
import ShipmentDetailState from "./ShipmentState.vue";
import ShipmentImageSlide from "./ShipmentImageSlide.vue";
import { useShipmentImageCreateStore } from "@/store/shipmentimage/create";
import { useShipmentImageUpdateStore } from "@/store/shipmentimage/update";
import * as enumHelper from "@/utils/enumHelper";
import { ShipmentImageRejectType } from "@/types/shipmentimage_reject_type";
import { ShipmentImageSectionTag } from "@/types/shipmentimagetags";
import * as apiToken from "@/utils/apiToken";
import { UserType } from "@/types/usertype";

const consignortab = ref(null);
const shippertab = ref(null);
const page = ref(1);
const shipmentImageListStore = useShipmentImageListStore();
const { items } = storeToRefs(shipmentImageListStore);
const route = useRoute();
const filters: Ref<Filters> = ref({});
const consignorLoadPictures: Ref<ShipmentImage[]> = ref([]);
const consignorUnloadPictures: Ref<ShipmentImage[]> = ref([]);
const consignorFilePictures: Ref<ShipmentImage[]> = ref([]);
const shipperLoadPictures: Ref<ShipmentImage[]> = ref([]);
const shipperUnloadPictures: Ref<ShipmentImage[]> = ref([]);
const shipperFilePictures: Ref<ShipmentImage[]> = ref([]);
filters.value.shipment = decodeURIComponent(route.params.id as string);
const shipmentImageCreateStore = useShipmentImageCreateStore();
const { created } = storeToRefs(shipmentImageCreateStore);
const shipmentImageUpdateStore = useShipmentImageUpdateStore();

const rejectType = enumHelper.getMap(ShipmentImageRejectType);
rejectType.unshift({ key: "", value: "" });
const consignor = "consignor";
const shipper = "shipper";
const imgUpdated = ref(false);

const payload = apiToken.getDecodedToken();
if (!payload) {
  throw new Error("Token payload invalid");
}

const userType = payload.user_type;
const loggedUserType = computed(() => {
  if (userType === UserType.CONSIGNOR) {
    return "consignor";
  } else if (userType === UserType.SHIPPER) {
    return "shipper";
  }
  return "";
});
await shipmentImageListStore.getItems({
  page: page.value,
  groups: ["shipment:detail:images"],
  ...filters.value,
});
function classifyItem() {
  consignorUnloadPictures.value = [];
  consignorLoadPictures.value = [];
  consignorFilePictures.value = [];

  shipperUnloadPictures.value = [];
  shipperLoadPictures.value = [];
  shipperFilePictures.value = [];
  items.value.forEach((item) => {
    if (item.tags?.includes(consignor)) {
      if (item.tags.includes(ShipmentImageSectionTag.unloadImages)) {
        consignorUnloadPictures.value.push(item);
      } else if (item.tags.includes(ShipmentImageSectionTag.loadImages)) {
        consignorLoadPictures.value.push(item);
      } else {
        consignorFilePictures.value.push(item);
      }
    }
    if (item.tags?.includes(shipper)) {
      if (item.tags?.includes(ShipmentImageSectionTag.unloadImages)) {
        shipperUnloadPictures.value.push(item);
      } else if (item.tags?.includes(ShipmentImageSectionTag.loadImages)) {
        shipperLoadPictures.value.push(item);
      } else {
        shipperFilePictures.value.push(item);
      }
    }
  });
}
classifyItem();

async function emitUpload(shipmentImage: any) {
  imgUpdated.value = false;
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
  imgUpdated.value = true;
}

async function emitAcceptFile(data: any) {
  await shipmentImageUpdateStore.approve(data.id as string);
  await shipmentImageListStore.getItems({
    page: page.value,
    groups: ["shipment:detail:images"],
    ...filters.value,
  });

  classifyItem();
}

async function emitRejectFile(data: any) {
  let causes: string[] = [];
  data.rejectedCauses.value.forEach((item: number) => {
    causes.push(rejectType[item].key);
  });

  await shipmentImageUpdateStore.reject(data.image.id as string, {
    rejectedCauses: causes,
  });
  await shipmentImageListStore.getItems({
    page: page.value,
    groups: ["shipment:detail:images"],
    ...filters.value,
  });
  classifyItem();
}
function isUserType(userType: string) {
  return loggedUserType.value === userType;
}
onBeforeUnmount(() => {
  shipmentImageCreateStore.$reset();
  imgUpdated.value = false;
});
</script>
