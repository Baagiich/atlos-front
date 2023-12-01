<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="item.loadType">
          <div>{{ $t("shipmentload.choiceShipmentLoadType") }}</div>
          <v-radio
            :label="$t('shipmentload.cargo')"
            :value="ShipmentLoadType.CARGO"
            color="indigo"
          ></v-radio>
          <v-radio
            :label="$t('shipmentload.regular')"
            :value="ShipmentLoadType.REGULAR"
            color="indigo"
          ></v-radio>
        </v-radio-group>
        <hr />
        <div>{{ $t("shipmentload.choiceShipmentType") }}</div>
        <v-radio-group v-model="item.shipmentType">
          <v-radio
            :label="$t('shipmentload.secureShipment')"
            :value="ShipmentType.SECURE"
            color="indigo"
          ></v-radio>
          <v-radio
            :label="$t('shipmentload.regularShipment')"
            :value="ShipmentType.REGULAR"
            color="indigo"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <div>
        {{ $t("shipmentload.choiceCurrencyType") }}
      </div>
      <v-select
        :items="currencyTypes"
        density="compact"
        label="Label"
        variant="outlined"
        clearable
        v-model="selectedCurrency"
        @update:modelValue="onCurrencySelect"
      ></v-select>
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
const props = defineProps<{
  values?: Shipment;
  errors?: SubmissionErrors;
}>();
const { t } = useI18n();

const violations = toRef(props, "errors");

const currencyTypes = ["MNT", "CNY", "RUB", "USD"];
const selectedCurrency = ref("");
const onCurrencySelect = () => {
  item.value.price = {
    amount: 0,
    currency: selectedCurrency.value,
  };
};
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const emit = defineEmits<{
  (e: "submit", item: Shipment): void;
}>();

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
