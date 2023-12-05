<template>
  <v-form ref="form">
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
        </v-radio-group>
        <div>{{ $t("shipmentload.choiceShipmentType") }}</div>
        <v-radio-group v-model="item.shipmentType" :rules="requireRules">
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
      <v-col cols="2">
        <v-sheet class="d-inline-flex" height="40">
          {{ $t("shipmentload.choiceCurrencyType") }}
        </v-sheet>

        <v-select
          :items="currencyTypes"
          :label="$t('shipmentload.currencyType')"
          variant="outlined"
          clearable
          v-model="selectedCurrency"
          @update:modelValue="onCurrencySelect"
          :rules="requireRules"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-btn color="primary" variant="text" @click="emitNextStep">{{ $t("nextStep") }}</v-btn>
          <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
            {{ $t("reset") }}
          </v-btn>
        </v-col>
      </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { Shipment } from "@/types/shipment";
import type { SubmissionErrors } from "@/types/error";
import { useI18n } from "vue-i18n";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import { ShipmentLoadType } from "@/types/shipment_load_type";
import { ShipmentType } from "@/types/shipment_type";

import { storeToRefs } from "pinia";
import { assertRequired } from "@/validations";
const props = defineProps<{
  errors?: SubmissionErrors;
}>();

const { t } = useI18n();

const requireRules = [assertRequired()];
const currencyTypes = ["MNT", "CNY", "RUB", "USD"];
const selectedCurrency = ref("");
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const onCurrencySelect = () => {
  item.value.currency =  selectedCurrency.value;
};

const emit = defineEmits<{
  (e: "next-step"): void;
}>();
async function emitNextStep() {
  const v = await form.value.validate();
  if (v.valid) {
    emit("next-step");
  }
}
const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
<style lang="scss">
.black-text label {
  opacity: unset;
}
</style>
