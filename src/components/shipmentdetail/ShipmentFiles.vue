<template>
  <v-container fluid>
    <v-row v-if="images.length > 0" align="center" justify="center" dense>
      <v-col
        v-for="(image, index) in images"
        :key="index"
        :cols="index % 2 === 1 ? 8 : 4"
      >
        <v-row>
          <v-col :cols="index % 2 === 1 ? 6 : 12">
            <v-card class="ma-4" min-height="100" max-width="400">
              <v-btn
                class="ma-2"
                rounded
                variant="plain"
                :color="
                  index % 2 === 1 && image.data.status !== 'approved'
                    ? 'orange'
                    : 'success'
                "
              >
                {{ $t("shipmentimage." + image.tag) }}
              </v-btn>

              <div v-if="image?.data.image" align="center" justify="center">
                <MediaObjectThumb :id="image.data.image"></MediaObjectThumb>
                <div class="ma-4">
                  <v-spacer></v-spacer>
                  <div v-if="rejected === image.data.image">
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

                  <div v-else-if="index % 2 === 1">
                    <div
                      v-if="
                        image.data.status === 'pending' &&
                        loggedUserType === 'consignor'
                      "
                    >
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
                        @click="handleReject(image.data.image)"
                      >
                        {{ $t("shipmentimage.reject") }}
                      </v-btn>
                    </div>
                    <v-card
                      v-else-if="image.data.status !== 'approved'"
                      class="ma-1 pa-1"
                      max-width="180"
                      color="orange-lighten-2"
                      variant="outlined"
                    >
                      <v-card-item>
                        <div
                          class="text-overline mb-1"
                          align="center"
                          justify="center"
                        >
                          {{
                            image.data.status === "rejected"
                              ? formatRejectedCauses(image?.data.rejectedCauses)
                              : $t("shipmentimage." + image.data.status)
                          }}
                        </div>
                      </v-card-item>
                    </v-card>
                  </div>
                </div>
              </div>

              <div v-else class="ma-2 pa-2 align-self-center">
                <v-img
                  height="100"
                  style="opacity: 0.2"
                  src="@/assets/placeholder.png"
                ></v-img>
              </div>
            </v-card>
          </v-col>
          <v-col
            v-if="index % 2 === 1 && uploadable"
            cols="4"
            class="mt-auto mb-auto"
          >
            <div min-height="100">
              <v-btn
                color="deep-purple-accent-4"
                prepend-icon="mdi mdi-folder-arrow-up-outline"
                @click="handleFileUpload(image.tag)"
              >
                {{ $t("shipmentimage.upload") }}</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-card-text v-else class="ma-16 pa-16" justify="center" align="center">
      {{ $t("shipmentimage.noImages") }}
    </v-card-text>
  </v-container>

  <v-overlay v-model="uploadOverlay" class="align-center justify-center">
    <FileUploader :has-emit="true" @sendResource="emitUpload"></FileUploader>
  </v-overlay>
</template>

<script setup lang="ts">
import { ShipmentImage } from "@/types/shipmentimage";
import { computed, Ref, ref, watch } from "vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
import * as enumHelper from "@/utils/enumHelper";
import FileUploader from "@/components/common/FileUploader.vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { ShipmentImageRejectType } from "@/types/shipmentimage_reject_type";
import { useI18n } from "vue-i18n";
import * as apiToken from "@/utils/apiToken";
import { UserType } from "@/types/usertype";
import { ShipmentImageSectionTag } from "@/types/shipmentimagetags";
const { t } = useI18n();
const props = defineProps<{
  items?: ShipmentImage[];
  uploadable?: boolean;
  imgUpdated?: boolean;
  fileTags?: string[];
}>();
const emit = defineEmits<{
  (e: "submitImg", value: any): void;
  (e: "rejectFile", value: any): void;
  (e: "acceptFile", value: any): void;
}>();
const route = useRoute();
const rejected = ref(false);
const uploadOverlay = ref(false);
const images: Ref<{ data: ShipmentImage; tag: string }[]> = ref([]);
const selectedTag: Ref<string[]> = ref([]);
const mediaObjectCreateStore = useMediaObjectCreateStore();
const { created } = storeToRefs(mediaObjectCreateStore);

const rejectType = enumHelper.getMap(ShipmentImageRejectType);

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
  await processData(props.fileTags ?? []);
}
async function processData(arrayItem: string[]) {
  images.value = [];
  arrayItem.forEach((tag) => {
    let foundMatch = false;
    props.items?.forEach((item) => {
      if (item.tags?.includes(tag) && !foundMatch) {
        images.value.push({
          data: item,
          tag: tag,
        });
        foundMatch = true;
        return;
      }
    });
    if (!foundMatch && props.uploadable === true) {
      images.value.push({
        data: {},
        tag: tag,
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

function handleFileUpload(tag: any) {
  uploadOverlay.value = true;
  selectedTag.value = [
    loggedUserType.value ?? "",
    ShipmentImageSectionTag.files,
    tag,
  ];
}
async function handleReject(data: any) {
  rejected.value = data;
}
watch(
  () => props.imgUpdated,
  (newVal) => {
    if (newVal === true) {
      formatItems();
    }
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
  emit("acceptFile", data);
}
</script>
