<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="6">
        <v-sheet class="d-flex align-end mb-6" height="100">
          <p class="text-uppercase" color="black">
            {{ title }}
          </p>
        </v-sheet>
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="selectedCountry"
              :label="$t('shipmentload.country')"
              :items="getCountryNames()"
              :rules="requireRules"
              variant="outlined"
              clearable
              @update:modelValue="onCountrySelect()"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="selectedCity"
              :label="$t('shipmentload.city')"
              :items="cityNames"
              :rules="requireRules"
              variant="outlined"
              clearable
              @update:model-value="setCityLocations"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="address.street"
              :error="Boolean(violations?.register)"
              :error-messages="violations?.register"
              :label="$t('shipmentload.address')"
              :rules="requireRules"
              variant="outlined"
              clearable
            >
              <template #append-inner>
                <v-icon style="cursor: pointer"> mdi-close </v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="address.zipCode"
              :error="Boolean(violations?.register)"
              :error-messages="violations?.register"
              :label="$t('shipmentload.zipCode')"
              :rules="zipCodeRules"
              variant="outlined"
              clearable
            >
              <template #append-inner>
                <v-icon style="cursor: pointer"> mdi-close </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="address.contactPhoneNunmber"
              :error="Boolean(violations?.register)"
              :error-messages="violations?.register"
              :label="$t('shipmentload.phoneNumber')"
              :rules="phoneNumberRules"
              variant="outlined"
              clearable
            >
              <template #append-inner>
                <v-icon style="cursor: pointer"> mdi-close </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="address.contactName"
              :error="Boolean(violations?.register)"
              :error-messages="violations?.register"
              :label="$t('shipmentload.contactPerson')"
              :rules="requireRules"
              variant="outlined"
              clearable
            >
              <template #append-inner>
                <v-icon style="cursor: pointer"> mdi-close </v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <GoogleMap
          class="rounded-xl overflow-hidden"
          :api-key="googleMapsApiKey"
          style="width: 100%; height: 400px; margin: 10px"
          :center="{ lat, lng }"
          :zoom="15"
          @click="onMapClick"
        >
          <CustomMarker
            :options="{
              position: { lat, lng },
              anchorPoint: 'BOTTOM_CENTER',
            }"
          >
            <div style="text-align: center">
              <div class="text-red" style="font-size: 16px">
                {{ title }}
              </div>
              <span
                class="mdi mdi-map-marker"
                style="color: red; font-size: 50px"
              ></span>
            </div>
          </CustomMarker>
        </GoogleMap>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { useCountryListStore } from "@/store/shipmentload/countrylist";
import { storeToRefs } from "pinia";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import { Filters } from "@/types/list";
import { Address } from "@/types/address";
import { SubmissionErrors } from "@/types/error";
import { State } from "@/types/state";
import { City } from "@/types/city";
import { VForm } from "vuetify/lib/components/index.mjs";
import {
  assertRequired,
  assertMaxLength,
  assertPhoneNumber,
} from "@/validations";
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const lat = ref(47.923293);
const lng = ref(106.928076);
const showMarker = ref(false);
const selectedCountry = ref(null);
const selectedCity = ref(null);
const cityNames = ref([]);
const page = ref(1);
const order = ref({});
const countryFilters: Ref<Filters> = ref({});
const countryListStore = useCountryListStore();
const { items: countryItems } = storeToRefs(countryListStore);
const props = defineProps<{
  address: Address;
  title: string;
  errors?: SubmissionErrors;
}>();
const violations = toRef(props, "errors");
const address = ref(props.address);
const title = ref(props.title);
const onCountrySelect = () => {
  selectedCity.value = null;
  if (selectedCountry.value) {
    cityNames.value = countryListStore.getCityNames(selectedCountry.value);
  }
};
const requireRules = [assertRequired()];
const phoneNumberRules = [
  assertRequired(),
  assertMaxLength(20),
  assertPhoneNumber(),
];
const zipCodeRules = [assertRequired(), assertMaxLength(10)];
const getCountryNames = () => {
  return countryItems.value.map((country) => country.name);
};

const setCityLocations = () => {
  if (!selectedCountry.value || !selectedCity.value) {
    return;
  }

  const selectedCountryItem = countryItems.value.find(
    (country) => country.name === selectedCountry.value,
  );

  if (!selectedCountryItem) {
    return;
  }

  const selectedCityItem = selectedCountryItem.states
    .flatMap((state: State) => state.cities)
    .find((city: City) => city.name === selectedCity.value);

  if (selectedCityItem && selectedCityItem.location) {
    lat.value = selectedCityItem.location.latitude;
    lng.value = selectedCityItem.location.longitude;
    address.value = address.value || {};
    address.value.location = address.value.location || {};
    address.value.location.latitude = selectedCityItem.location.latitude;
    address.value.location.longitude = selectedCityItem.location.longitude;
    showMarker.value = true;
  }
  if (selectedCityItem["@id"]) {
    address.value.city = selectedCityItem["@id"];
  }
};
async function getCountry() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
    ...countryFilters.value,
    groups: ["city:list"],
  });
}
getCountry();
const onMapClick = (event: google.maps.MapMouseEvent) => {
  if (event.latLng === null) return;
  lat.value = event.latLng.lat();
  lng.value = event.latLng.lng();
  address.value = address.value || {};
  address.value.location = address.value.location || {};
  address.value.location.latitude = event.latLng.lat();
  address.value.location.longitude = event.latLng.lng();
  showMarker.value = true;
};

async function validateForm() {
  if (!form.value) {
    return false;
  }
  const v = await form.value.validate();
  showMarker.value = false;
  return v.valid;
}
defineExpose({
  validateForm,
});
const form: Ref<VForm | null> = ref(null);
</script>
