<template>
  <p v-if="error">
    {{ error }}
  </p>
  <v-img v-else-if="item" :width="300" :src="item.contentUrl">
    <template #placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey-lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script setup lang="ts">
import { useMediaObjectShowStore } from "@/store/mediaobject/show";
import { storeToRefs } from "pinia";

const props = defineProps<{
  id: string;
}>();

const mediaObjectShowStore = useMediaObjectShowStore();
const { retrieved, error } = storeToRefs(mediaObjectShowStore);

await mediaObjectShowStore.retrieve(decodeURIComponent(props.id));

const item = retrieved?.value;
</script>
