<template>
  <v-container fluid>
    <v-sheet class="mx-auto" elevation="8">
      <v-slide-group
        v-if="images.length > 0"
        v-model="model"
        class="pa-4"
        show-arrows
      >
        <v-slide-group-item v-for="(image, index) in images" :key="index">
          <v-card
            :class="['ma-4']"
            min-height="200"
            width="300"
            justify="center"
            align="center"
          >
            <v-btn class="ma-2" rounded variant="plain">
              {{ $t("shipmentimage." + image.tag) }}
            </v-btn>

            <div v-if="image?.data.image">
              <MediaObjectThumb :id="image.data.image"></MediaObjectThumb>
              <v-btn
                v-if="uploadable"
                class="ma-2 pa-2"
                icon="mdi-plus"
                size="small"
                @click="handleFileUpload(image)"
              ></v-btn>
            </div>
            <div v-else class="ma-2 pa-2 align-self-center">
              <v-btn
                icon="mdi-plus"
                size="small"
                @click="handleUpload(image.tag)"
              ></v-btn>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <v-card-text v-else class="ma-16 pa-16" justify="center" align="center">
        {{ $t("shipmentimage.noImages") }}
      </v-card-text>
    </v-sheet>
  </v-container>

  <v-overlay v-model="uploadOverlay" class="align-center justify-center">
    <FileUploader :has-emit="true" @sendResource="emitUpload"></FileUploader>
  </v-overlay>
</template>

<script setup lang="ts">
import { ShipmentImage } from "@/types/shipmentimage";
import { computed, Ref, ref, watch } from "vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
import { ShipmentImageTags } from "@/types/shipmentimagetags";
import * as enumHelper from "@/utils/enumHelper";
import FileUploader from "@/components/common/FileUploader.vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import * as apiToken from "@/utils/apiToken";
import { UserType } from "@/types/usertype";

const model = ref(null);
const props = defineProps<{
  items?: ShipmentImage[];
  defaultImageTags?: string;
  uploadable?: boolean;
  imgUpdated?: boolean;
}>();
const emit = defineEmits<{
  (e: "submitImg", value: any): void;
  (e: "rejectFile", value: any): void;
  (e: "acceptFile", value: any): void;
}>();
const route = useRoute();
const rejected = ref(false);
const imageTags = enumHelper.getMap(ShipmentImageTags);
const uploadOverlay = ref(false);
const images: Ref<{ data: ShipmentImage; tag: string }[]> = ref([]);
const selectedTag: Ref<string[]> = ref([]);
const mediaObjectCreateStore = useMediaObjectCreateStore();
const { created } = storeToRefs(mediaObjectCreateStore);

const rejectedCauses = ref([]);
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

async function formatItems() {
  rejectedCauses.value = [];
  rejected.value = false;
  await processData(imageTags);
}
async function processData(arrayItem: { key: string; value: any }[]) {
  images.value = [];
  arrayItem.forEach((tag) => {
    let foundMatch = false;
    props.items?.forEach((item) => {
      if (item.tags?.includes(tag.value) && !foundMatch) {
        images.value.unshift({
          data: item,
          tag: tag.value,
        });
        foundMatch = true;
        return;
      }
    });
    if (!foundMatch && props.uploadable === true) {
      images.value.push({
        data: {},
        tag: tag.value,
      });
    }
  });
}

const uploadedImg = computed(() => {
  if (created?.value) {
    return {
      tags: selectedTag.value,
      image: created.value?.["@id"],
      shipment: decodeURIComponent(route.params.id as string),
    };
  }
  return {};
});

function handleUpload(tag: string) {
  uploadOverlay.value = true;
  selectedTag.value = [
    loggedUserType.value ?? "",
    props.defaultImageTags ?? "",
    tag,
  ];
}
function handleFileUpload(image: any) {
  uploadOverlay.value = true;
  handleUpload(image.tag);
}
watch(
  () => props.imgUpdated,
  (newVal) => {
    if (newVal === true) {
      formatItems();
    }
  },
);
formatItems();
function emitUpload() {
  uploadOverlay.value = false;
  emit("submitImg", uploadedImg);
}
</script>
