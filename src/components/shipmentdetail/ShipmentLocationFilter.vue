<template>
  <v-container fluid>
    <v-row>
     
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.startAt"
          :label="$t('shipment.timeFrom')"
          type="dateTime"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.endAt"
          :label="$t('shipment.timeTo')"
          type="dateTime"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { Shipment } from "@/types/shipment";
import { DeviceLocation } from "@/types/devicelocation";

const props = defineProps<{
  values: DeviceLocation;
}>();

const item = toRef(props, "values");
</script>
