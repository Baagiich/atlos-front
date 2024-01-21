<template>
  <p v-if="error">
    {{ error }}
  </p>
  <v-img
    v-else-if="item"
    :width="300"
    :src="item.contentUrl"
    @click="zoomOut(item.contentUrl)"
  >
    <template #placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey-lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>

  <v-overlay v-model="overlay" class="align-center justify-center">
    <v-img :width="700" :src="selectedImage">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey-lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-overlay>
</template>

<script setup lang="ts">
import { useMediaObjectShowStore } from "@/store/mediaobject/show";

import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const props = defineProps<{
  id: string;
}>();

const mediaObjectShowStore = useMediaObjectShowStore();
const { retrieved, error } = storeToRefs(mediaObjectShowStore);
const item = ref();
retrieveImg(props.id);
const overlay = ref(false);

async function retrieveImg(id: string) {
  await mediaObjectShowStore.retrieve(decodeURIComponent(id));
  item.value = retrieved?.value;
}
const selectedImage = ref();
const zoomOut = (image: string | undefined) => {
  overlay.value = true;
  selectedImage.value = image ?? "";
};
watch(overlay, (newValue) => {
  newValue && setTimeout(() => (overlay.value = false), 3000);
});
watch(
  () => props.id,
  (newVal) => {
    retrieveImg(newVal);
  },
);
</script>
