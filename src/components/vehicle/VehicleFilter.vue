<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipper"
          :label="$t('vehicle.shipper')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.plateNumber"
          :label="$t('vehicle.plateNumber')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { Vehicle } from "@/types/vehicle";

const props = defineProps<{
  values: Vehicle;
}>();

const item = toRef(props, "values");
</script>
