<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.vehicle"
          :label="$t('vehicleimage.vehicle')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.tag"
          :label="$t('vehicleimage.tag')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { VehicleImage } from "@/types/vehicleimage";

const props = defineProps<{
  values: VehicleImage;
}>();

const item = toRef(props, "values");
</script>
