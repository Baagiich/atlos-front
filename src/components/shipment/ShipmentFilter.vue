<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      <v-select
        v-model="item.state"
        :items="statusList"
        :item-props="itemProps"
        :label="$t('shipment.state')"
        variant="outlined"
        type="string"
        density="compact"
        clearable
      />
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <VueDatePicker
        v-model="item.loadAt"
        :placeholder="$t('shipment.loadAt')"
        format="yyyy/MM/dd"
        no-today
        auto-apply
        :enable-time-picker="false"
      />
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <VueDatePicker
        v-model="item.unloadAt"
        :placeholder="$t('shipment.unloadAt')"
        format="yyyy/MM/dd"
        no-today
        auto-apply
        :enable-time-picker="false"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { Filters } from "@/types/list";
import { ShipmentStateString } from "@/types/shipment_state";
import * as enumHelper from "@/utils/enumHelper";
import { useI18n } from "vue-i18n";
import VueDatePicker from "@vuepic/vue-datepicker";

const { t } = useI18n();
const props = defineProps<{
  values: Filters;
}>();

const item = toRef(props, "values");
const statusList = enumHelper.getMap(ShipmentStateString);
statusList.unshift({ key: "", value: "" });

function itemProps(item: any) {
  return {
    title: item.value ? t("shipment." + item.value) : "",
  };
}
</script>
