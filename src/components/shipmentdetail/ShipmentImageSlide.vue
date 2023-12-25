<template>
    <v-container fluid>
    <v-sheet class="mx-auto" elevation="8">
        <v-slide-group
            v-model="model"
            class="pa-4"
            show-arrows
        >
            <v-slide-group-item
            v-for="(item, index) in  items"
            :key="index"
            v-slot="{ isSelected, toggle }"
            >
            <v-card
                :class="['ma-4']"
                max-height="400"
                width="300"
                @click="toggle"
            >
                <MediaObjectThumb :id="item.image"></MediaObjectThumb>
                
                <v-btn
                    class="ma-2"
                    rounded
                    :color="isSelected ? 'primary' : undefined"
                    variant="outlined"
                >
                    {{ item.status === 'rejected' ? item.rejectedCauses : item.status }}
                </v-btn>
                
            </v-card>
            </v-slide-group-item>
        </v-slide-group>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ShipmentImage } from "@/types/shipmentimage";
import { ref } from "vue";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
const model = ref(null);
const props = defineProps<{
  items?: [ShipmentImage];
}>();

const items = props.items;
</script>
