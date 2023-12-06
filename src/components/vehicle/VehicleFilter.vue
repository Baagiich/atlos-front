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
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.status"
          :label="$t('vehicle.status')"
          :items="vehiclesStatus"
          item-title="key"
          item-value="value"
        />
       
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { Vehicle } from "@/types/vehicle";
import * as enumHelper from "@/utils/enumHelper";
import { VehicleStatus } from "@/types/vehiclestatus";

const props = defineProps<{
  values: Vehicle;
}>();

const item = toRef(props, "values");

const vehiclesStatus = enumHelper.getMap(VehicleStatus);
vehiclesStatus.unshift({ key: "", value: "" });
</script>
