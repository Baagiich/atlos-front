<template>
  <v-form v-if="item" ref="form">
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="item.loadType" :rules="requireRules">
          <div>{{ $t("shipmentload.choiceShipmentLoadType") }}</div>
          <v-radio
            :label="$t('shipmentload.cargo')"
            :value="ShipmentLoadType.CARGO"
            color="indigo"
            class="black-text"
          ></v-radio>
          <v-radio
            :label="$t('shipmentload.regular')"
            :value="ShipmentLoadType.REGULAR"
            color="indigo"
            class="black-text"
          ></v-radio>
          <v-radio
            :label="$t('shipmentload.dangerousGood')"
            :value="ShipmentLoadType.DANGEROUS"
            color="indigo"
            class="black-text"
          ></v-radio>
        </v-radio-group>
        <div>{{ $t("shipmentload.choiceShipmentType") }}</div>
        <v-radio-group
          v-model="item.shipmentType"
          :rules="requireRules"
          :disabled="item.loadType === ShipmentLoadType.DANGEROUS"
        >
          <v-radio
            :label="$t('shipmentload.secureShipment')"
            :value="ShipmentType.SECURE"
            color="indigo"
            class="black-text"
          ></v-radio>
          <v-radio
            :label="$t('shipmentload.regularShipment')"
            :value="ShipmentType.REGULAR"
            color="indigo"
            class="black-text"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-sheet class="d-inline-flex" height="40">
          {{ $t("shipmentload.choiceCurrencyType") }}
        </v-sheet>

        <v-select
          v-model="selectedCurrency"
          :label="$t('shipmentload.currencyType')"
          variant="outlined"
          clearable
          :items="currencyTypes"
          :rules="requireRules"
          item-title="key"
          item-value="value"
          @update:modelValue="onCurrencySelect"
        ></v-select>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, Ref } from "vue";
import { VForm } from "vuetify/components";
import type { SubmissionErrors } from "@/types/error";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import { ShipmentLoadType } from "@/types/shipment_load_type";
import { ShipmentType } from "@/types/shipment_type";
import { CurrencyType } from "@/types/currency_type";
import { storeToRefs } from "pinia";
import { assertRequired } from "@/validations";
import * as enumHelper from "@/utils/enumHelper";

defineProps<{
  errors?: SubmissionErrors;
  disabled?: boolean;
}>();

const requireRules = [assertRequired()];
const selectedCurrency = ref("");
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const currencyTypes = enumHelper.getMap(CurrencyType);
currencyTypes.unshift({ key: "", value: "" });
const onCurrencySelect = () => {
  if (!item || !item.value) {
    return;
  }
  item.value.currency = selectedCurrency.value;
};

async function validateForm() {
  if (!form.value) {
    return false;
  }
  const v = await form.value.validate();
  return v.valid;
}
const form: Ref<VForm | null> = ref(null);
defineExpose({
  validateForm,
});
onBeforeUnmount(() => {
  newShipmentStore.$reset();
});
</script>
<style lang="scss">
.black-text label {
  opacity: unset;
}
</style>
