<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
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
              :label="$t('shipmentload.country')"
              v-model="selectedCountry"
              :items="getCountryNames()"
              :rules="requireRules"
              @update:modelValue="onCountrySelect"
              variant="outlined"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              :label="$t('shipmentload.city')"
              v-model="selectedCity"
              :items="citiesNames"
              :rules="requireRules"
              @update:model-value="setCityLocations"
              variant="outlined"
              clearable
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
              :rules="requireRules"
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
              :rules="requireRules"
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
              <div style="font-size: 1.125rem">Vuejs Amsterdam</div>
              <img
                src="https://vuejs.org/images/logo.png"
                width="50"
                height="50"
                style="margin-top: 8px"
              />
            </div>
          </CustomMarker>
        </GoogleMap>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { useCountryListStore } from "@/store/shipmentload/countrylist";
import { storeToRefs } from "pinia";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import { Filters } from "@/types/list";
import { assertRequired } from "@/validations";

const { t } = useI18n();
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const lat = ref(47.923293);
const lng = ref(106.928076);
const showMarker = ref(false);
const selectedCountry = ref(null);
const selectedCity = ref(null);
const citiesNames = ref([]);
const page = ref(1);
const order = ref({});
const countryFilters: Ref<Filters> = ref({});
const countryListStore = useCountryListStore();
const {
  items: countryItems,
  totalItems: countryTotalItems,
  error: countryError,
  isLoading: countryIsLoading,
} = storeToRefs(countryListStore);
const props = defineProps(["address", "title"]);
const violations = toRef(props, "errors");
const address = ref(props.address);
const title = ref(props.title);
const onCountrySelect = () => {
  selectedCity.value = null;
  citiesNames.value = countryListStore.getCityNames(selectedCountry.value);
};
const requireRules = [assertRequired()];
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
  const selectedCityItem = selectedCountryItem.states
    .flatMap((state) => state.cities)
    .find((city) => city.name === selectedCity.value);

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
const onMapClick = (event: google.maps.MouseEvent) => {
  lat.value = event.latLng.lat();
  lng.value = event.latLng.lng();
  address.value = address.value || {};
  address.value.location = address.value.location || {};
  address.value.location.latitude = event.latLng.lat();
  address.value.location.longitude = event.latLng.lng();
  showMarker.value = true;
};

const emit = defineEmits<{
  (e: "submit", item: Address): void;
}>();

const emitSubmit = () => {
  showMarker.value = false;
  emit("submit", address.value);
};
const form: Ref<VForm | null> = ref(null);

const resetForm = () => {
  if (!form.value) return;

  form.value.reset();
  showMarker.value = false;
};
</script>
