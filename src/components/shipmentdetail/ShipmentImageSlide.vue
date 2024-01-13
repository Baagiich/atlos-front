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
              {{ $t("shipmentimage." + image?.tag) }}
            </v-btn>

            <div v-if="image?.data.image">
              <MediaObjectThumb :id="image?.data.image"></MediaObjectThumb>
              <div v-if="files">
                <div v-if="rejected">
                  <v-card-subtitle class="mt-2">
                    {{ $t("shipmentimage.selectTitle") }}
                  </v-card-subtitle>
                  <v-select
                    v-model="rejectedCauses"
                    multiple
                    class="ma-2"
                    :label="$t('shipmentimage.select')"
                    :items="rejectType"
                    variant="outlined"
                    :item-title="
                      (item) =>
                        item.key ? $t('shipmentimage.' + item.key) : ''
                    "
                    item-value="value"
                  ></v-select>

                  <v-btn
                    class="ma-2"
                    variant="outlined"
                    color="error"
                    @click="emitReject(image.data)"
                  >
                    {{ $t("shipmentimage.reject") }}
                  </v-btn>
                </div>

                <div v-else>
                  <div v-if="image?.data.status === 'pending' && !consignor">
                    <v-btn
                      class="ma-2"
                      variant="outlined"
                      color="success"
                      @click="emitAccept(image.data)"
                    >
                      {{ $t("shipmentimage.accept") }}
                    </v-btn>
                    <v-btn
                      class="ma-2"
                      variant="outlined"
                      color="error"
                      @click="handleReject"
                    >
                      {{ $t("shipmentimage.reject") }}
                    </v-btn>
                  </div>
                  <v-card
                    v-else
                    class="ma-1 pa-1"
                    max-width="180"
                    :color="
                      image?.data.status === 'approved'
                        ? 'success'
                        : 'purple-accent-2'
                    "
                    variant="outlined"
                  >
                    <v-card-item>
                      <div>
                        <div class="text-overline mb-1">
                          {{
                            image?.data.status === "rejected"
                              ? formatRejectedCauses(image?.data.rejectedCauses)
                              : $t("shipmentimage." + image?.data.status)
                          }}
                        </div>
                      </div>
                    </v-card-item>
                  </v-card>
                  <v-btn
                    v-if="consignor"
                    class="ma-2 pa-2"
                    icon="mdi-plus"
                    size="small"
                    @click="handleUpload(image?.tag)"
                  ></v-btn>
                </div>
              </div>
              <v-btn
                v-else-if="consignor"
                class="ma-2 pa-2"
                icon="mdi-plus"
                size="small"
                @click="handleUpload(image?.tag)"
              ></v-btn>
            </div>
            <div v-else class="ma-2 pa-2 align-self-center">
              <v-btn
                icon="mdi-plus"
                size="small"
                @click="handleUpload(image?.tag)"
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
    <FileUploader></FileUploader>
    <div justify="center" align="center" class="ma-4 mt-8">
      <v-btn v-if="uploadedImg.image" color="green" @click="emitUpload">
        {{ $t("shipmentimage.upload") }}
      </v-btn>
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
import { ShipmentImageRejectType } from "@/types/shipmentimage_reject_type";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const model = ref(null);
const props = defineProps<{
  items?: ShipmentImage[];
  files?: boolean;
  consignor?: boolean;
}>();
const emit = defineEmits<{
  (e: "submitImg", value: any): void;
  (e: "rejectFile", value: any): void;
  (e: "acceptFile", value: any): void;
}>();
const route = useRoute();
const rejected = ref(false);
const imageTags = enumHelper.getMap(ShipmentImageTags);
const fileTags = enumHelper.getMap(ShipmentFileTags);
const uploadOverlay = ref(false);
const images: Ref<{ data: ShipmentImage; tag: string }[]> = ref([]);
const selectedTag: Ref<string[]> = ref([]);
const mediaObjectCreateStore = useMediaObjectCreateStore();
const { created } = storeToRefs(mediaObjectCreateStore);

const rejectType = enumHelper.getMap(ShipmentImageRejectType);
rejectType.unshift({ key: "", value: "" });
const rejectedCauses = ref([]);
const imageBeingUpdated = ref(false);
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
    if (!foundMatch && props.consignor) {
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
  props.items?.forEach((item) => {
    if (item.tags?.includes(tag)) {
      selectedTag.value = item.tags;
    } else {
      selectedTag.value = [item.tags?.[0] as string, tag];
    }
  });
}

async function handleReject() {
  rejected.value = true;
  imageBeingUpdated.value = true;
}
watch(
  () => props.items,
  () => {
    formatItems();
  },
);
function formatRejectedCauses(data: any) {
  const formattedData = data.map((item: any) => {
    return t("shipmentimage." + item);
  });

  return formattedData.join(", ");
}
formatItems();
function emitUpload() {
  uploadOverlay.value = false;
  emit("submitImg", uploadedImg);
}

function emitReject(image: any) {
  emit("rejectFile", { image, rejectedCauses });
}

function emitAccept(data: any) {
  imageBeingUpdated.value = true;
  emit("acceptFile", data);
}
</script>
