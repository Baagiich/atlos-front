<template>
    <v-form ref="form" @submit.prevent="emitSubmit">
      <v-row>
        <v-col cols="12">

          <v-radio-group
          v-model="item.loadType"
    >
    <div>{{ $t('shipmentload.choiceShipmentLoadType') }}</div>
        <v-radio
          :label="$t('shipmentload.cargo')"
          :value= ShipmentLoadType.CARGO
          color="indigo"
        ></v-radio>
        <v-radio
          :label="$t('shipmentload.regular')"
          :value=ShipmentLoadType.REGULAR
          color="indigo"
        ></v-radio>
      </v-radio-group>
      <hr>
    <div>{{ $t('shipmentload.choiceShipmentType') }}</div>
      <v-radio-group
      v-model="item.shipmentType"
      >
        <v-radio
          :label="$t('shipmentload.secureShipment')"
          :value=ShipmentType.SECURE
          color="indigo"
        ></v-radio>
        <v-radio
          :label="$t('shipmentload.regularShipment')"
          :value=ShipmentType.REGULAR
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
        ></v-select>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>
  
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
  import { ShipmentLoadType}  from "@/types/shipment_load_type";
  import { ShipmentType}  from "@/types/shipment_type";

import { storeToRefs } from "pinia";
  const props = defineProps<{
    values?: Shipment;
    errors?: SubmissionErrors;
  }>();
  const { t } = useI18n();
  
  const violations = toRef(props, "errors");
  
  const item: Ref<Shipment> = ref({});
  const currencyTypes = [
  'MNT', 'CNY', 'RUB', 'USD'
  ]
  const selectedCurrency = ref("");
 
  const newShipmentStore = useCreateNewShipmentStore();
  const { items, totalItems, error, isLoading } = storeToRefs(newShipmentStore);
  const emit = defineEmits<{
    (e: "submit", item: Shipment): void;
  }>();
  
  function emitSubmit() {
    item.value.price = {
      amount: 0,
      currency: selectedCurrency.value,
    };
    newShipmentStore.setItems([item.value]);

    emit("submit", item.value);
  }
  
  const form: Ref<VForm | null> = ref(null);
  
  function resetForm() {
    if (!form.value) return;
  
    form.value.reset();
  }
  </script>
  