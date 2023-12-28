<template>
  <v-container fluid>
    <v-sheet class="mx-auto" elevation="8">
      <v-slide-group v-model="model" class="pa-4" show-arrows>
        <v-slide-group-item
          v-for="(image, index) in images"
          :key="index"
          v-slot="{ isSelected }"
        >
          <v-card
            :class="['ma-4']"
            min-height="300"
            width="300"
            justify="center"
            align="center"
          >
            <v-btn class="ma-2" rounded variant="plain">
              {{ $t("shipmentimage." + image?.tag) }}
            </v-btn>

            <div v-if="image?.data.image">
              <MediaObjectThumb :id="image?.data.image"></MediaObjectThumb>
              <v-btn
                class="ma-2"
                rounded
                :color="isSelected ? 'primary' : undefined"
                variant="outlined"
              >
                {{
                  image?.data.status === "rejected"
                    ? image?.data.rejectedCauses
                    : image?.data.status
                }}
              </v-btn>
              <v-btn
                icon="mdi-plus"
                size="small"
                @click="handleUpload(image?.tag)"
              ></v-btn>
            </div>
            <div v-else class="mt-16">
              <v-btn
                icon="mdi-plus"
                size="small"
                @click="handleUpload(image?.tag)"
              ></v-btn>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-container>

  <v-overlay v-model="uploadOverlay" class="align-center justify-center">
    <FileUploader></FileUploader>
    <div justify="center" align="center" class="ma-4 mt-8">
      <v-btn v-if="uploadedImg.image" color="green" @click="emitUpload">{{
        $t("shipmentimage.upload")
      }}</v-btn>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { ShipmentImage } from "@/types/shipmentimage";
import { computed, Ref, ref, watch } from "vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
import { ShipmentFileTags, ShipmentImageTags } from "@/types/shipmentimagetags";
import * as enumHelper from "@/utils/enumHelper";
import FileUploader from "@/components/common/FileUploader.vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
const model = ref(null);
const props = defineProps<{
  items?: ShipmentImage[];
  files?: boolean;
}>();
const emit = defineEmits<{
  (e: "submitImg", value: any): void;
}>();
const route = useRoute();

const imageTags = enumHelper.getMap(ShipmentImageTags);
const fileTags = enumHelper.getMap(ShipmentFileTags);
const uploadOverlay = ref(false);
const images: Ref<{ data: ShipmentImage; tag: string }[]> = ref([]);
const selectedTag: Ref<string[]> = ref([]);
const mediaObjectCreateStore = useMediaObjectCreateStore();
const { created, isLoading, error, violations } = storeToRefs(
  mediaObjectCreateStore,
);

async function formatItems() {
  props.files ? await processData(fileTags) : await processData(imageTags);
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
    if (!foundMatch) {
      images.value.push({
        data: {},
        tag: tag.value,
      });
    }
  });
}

function handleUpload(tag: string) {
  uploadOverlay.value = true;
  props.items?.forEach((item) => {
    if (item.tags?.includes(tag)) {
      selectedTag.value = item.tags;
    } else {
      selectedTag.value = [item.tags?.[0] as string, tag];
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
watch(
  () => props.items,
  () => {
    formatItems();
  },
);

formatItems();
function emitUpload() {
  uploadOverlay.value = false;
  emit("submitImg", uploadedImg);
}
</script>
