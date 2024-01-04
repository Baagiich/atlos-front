<template>
  <v-stepper alt-labels>
    <v-stepper-header>
      <template
        v-for="(stateValue, stateIndex) in shipmentState"
        :key="'stepper-header-' + stateIndex"
      >
        <v-divider v-if="stateIndex >= 2"></v-divider>
        <v-stepper-item
          v-if="stateIndex >= 1"
          :complete="stateValue.value <= currentShipmentStateIndex"
          :value="stateValue.value"
        >
          <template #title>
            {{ $t(`shipment.${stateValue.key}`) }}
          </template></v-stepper-item
        >
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<script setup lang="ts">
import { useShipmentDetailStore } from "@/store/shipment/detail";
import { ShipmentState } from "@/types/shipment_state";
import * as enumHelper from "@/utils/enumHelper";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
const shipmentDetailStore = useShipmentDetailStore();
const { retrieved } = storeToRefs(shipmentDetailStore);
const route = useRoute();
async function locationList() {
  await shipmentDetailStore.retrieve(
    decodeURIComponent(route.params.id as string),
  );
}
locationList();
const shipmentState = enumHelper.getMap(ShipmentState);
shipmentState.unshift({ key: "", value: "" });

const currentShipmentStateIndex = computed(() => {
  return retrieved && retrieved.value?.state
    ? ShipmentState[retrieved.value.state as keyof typeof ShipmentState]
      ? ShipmentState[retrieved.value.state as keyof typeof ShipmentState]
      : 0
    : 0;
});
</script>
