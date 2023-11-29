<template>
    <v-form ref="form" @submit.prevent="emitSubmit">
      <v-row>
        <div>{{ $t('shipmentload.loadLocation') }}</div>
        <v-col cols="2">
          <v-select
            label="Select"
            v-model="selectedCountry"
            :items="getCountryNames()"
            @update:modelValue="onCountrySelect"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            label="Select"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
          ></v-select>
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
  import { useCountryListStore } from "@/store/shipmentload/countrylist";
  import { useCityListStore } from "@/store/shipmentload/citylist";

import { storeToRefs } from "pinia";
import { Filters } from "@/types/list";
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
  const selectedCountry = ref(null);
  const newShipmentStore = useCreateNewShipmentStore();
  const { items, totalItems, error, isLoading } = storeToRefs(newShipmentStore);

  const countryListStore = useCountryListStore();
  const { items: countryItems, totalItems: countryTotalItems, error: countryError, isLoading: countryIsLoading } = storeToRefs(countryListStore);
  const onCountrySelect = () => {
    console.log('Selected Country:', selectedCountry.value);
  };
  const getCountryNames = () => {
    return countryItems.value.map((country) => country.name);
  };
  const cityListStore = useCityListStore();
  const { items: cityItems, totalItems: cityTotalItems, error: cityError, isLoading: cityIsLoading } = storeToRefs(cityListStore);
  
  const page = ref(1);
const order = ref({});
const countryFilters: Ref<Filters> = ref({});

  async function getCountry() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
    ...countryFilters.value,
    groups: ["country:list"],
  });
}
async function getCity() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
  });
}
getCountry();
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
  