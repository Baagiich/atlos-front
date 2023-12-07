<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.shipment"
          :label="$t('shipmentload.shipment')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { ShipmentLoad } from "@/types/shipmentload";

const props = defineProps<{
  values: ShipmentLoad;
}>();

const item = toRef(props, "values");
</script>
