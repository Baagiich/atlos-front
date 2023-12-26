<template>
  <v-container fluid>
    <v-sheet class="mx-auto" elevation="8">
      <v-slide-group v-model="model" class="pa-4" show-arrows>
        <v-slide-group-item
          v-for="(item, index) in items"
          :key="index"
          v-slot="{ isSelected }"
        >
          <v-card
            :class="['ma-4']"
            max-height="400"
            width="300"
            justify="center"
            align="center"
          >
            <MediaObjectThumb :id="item.image"></MediaObjectThumb>
            <v-btn
              class="ma-2"
              rounded
              :color="isSelected ? 'primary' : undefined"
              variant="outlined"
            >
              {{
                item.status === "rejected" ? item.rejectedCauses : item.status
              }}
            </v-btn>
          </v-card>
        </v-slide-group-item>

        <v-slide-group-item
          v-for="n in 4"
          :key="n"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <v-card
            color="grey-lighten-1"
            :class="['ma-4', selectedClass]"
            max-height="400"
            width="300"
            @click="toggle"
          >
            <div class="d-flex fill-height align-center justify-center">
              <v-scale-transition>
                <v-icon
                  v-if="isSelected"
                  color="white"
                  size="48"
                  icon="mdi-close-circle-outline"
                ></v-icon>
              </v-scale-transition>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ShipmentImage } from "@/types/shipmentimage";
import { ref, watch } from "vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";

const model = ref(null);
const props = defineProps<{
  items?: [ShipmentImage];
}>();

const items = props.items;
</script>
