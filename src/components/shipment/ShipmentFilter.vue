<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      <v-select
        v-model="item.state"
        :items="statusList"
        item-title="key"
        item-value="value"
        :label="$t('shipment.state')"
        variant="outlined"
        type="string"
        density="compact"
      />
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <v-text-field
        v-model="item.loadAt"
        :label="$t('shipment.loadAt')"
        variant="outlined"
        size="small"
        type="dateTime"
        density="compact"
      />
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <v-text-field
        v-model="item.unloadAt"
        :label="$t('shipment.unloadAt')"
        variant="outlined"
        type="dateTime"
        density="compact"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { Filters } from "@/types/list";
import { ShipmentStateString } from "@/types/shipment_state";
import * as enumHelper from "@/utils/enumHelper";

const props = defineProps<{
  values: Filters;
}>();

const item = toRef(props, "values");
const statusList = enumHelper.getMap(ShipmentStateString);
statusList.unshift({ key: "", value: "" });
</script>
