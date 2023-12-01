<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12">
        <div>{{ $t("shipmentload.loadLocation") }}</div>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="4">
            <v-select
              label="Country"
              v-model="selectedCountry"
              :items="getCountryNames()"
              @update:modelValue="onCountrySelect"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              label="city"
              v-model="selectedCity"
              :items="getCityNames()"
              @update:model-value="setCityLocations"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
            v-model="address.street"
            :error="Boolean(123
             ?.register)"
            :error-messages="violations?.register"
            :label="$t('shipmentload.address')"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
              >
                mdi-close
              </v-icon>
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
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
            v-model="address.contactPhoneNunmber"
            :error="Boolean(violations?.register)"
            :error-messages="violations?.register"
            :label="$t('shipmentload.phoneNumber')"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
            v-model="address.contactName"
            :error="Boolean(violations?.register)"
            :error-messages="violations?.register"
            :label="$t('shipmentload.contactPerson')"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <GoogleMap
          api-key="AIzaSyDElKHA_psEg_DqGl5m84Dx7fpJk2H-eHg"
          style="width: 100%; height: 500px"
          :center="center"
          :zoom="15"
          @click="onMapClick"
          :key="mapKey"
        >
          <CustomMarker
            :options="{ position: center, anchorPoint: 'BOTTOM_CENTER' }"
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
import { ref, Ref, toRef, reactive  } from "vue";
import type { Shipment } from "@/types/shipment";
import type { SubmissionErrors } from "@/types/error";
import { useI18n } from "vue-i18n";
import { useCountryListStore } from "@/store/shipmentload/countrylist";
import { storeToRefs } from "pinia";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import { Filters } from "@/types/list";
import {Address} from "@/types/address"


const { t } = useI18n();

const center = ref({ lat: 47.923293, lng: 106.928076 });
const showMarker = ref(false);

const selectedCountry = ref(null);
const selectedCity = ref(null);
const page = ref(1);
const order = ref({});
const countryFilters: Ref<Filters> = ref({});
const countryListStore = useCountryListStore();
const mapKey = ref(0);
const {
  items: countryItems,
  totalItems: countryTotalItems,
  error: countryError,
  isLoading: countryIsLoading,
} = storeToRefs(countryListStore);
const props = defineProps(["address"]);
const address = ref(props.address);
const onCountrySelect = () => {
  selectedCity.value = null;
};

const getCountryNames = () => {
  return countryItems.value.map((country) => country.name);
};

const getCityNames = () => {
  if (!selectedCountry.value) {
    return [];
  }

  const selectedCountryItem = countryItems.value.find(
    (country) => country.name === selectedCountry.value,
  );

  if (!selectedCountryItem) {
    return [];
  }

  const cities = selectedCountryItem.states.flatMap((state) =>
    state.cities.map((city) => city.name),
  );

  return cities;
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
    center.value.lat = selectedCityItem.location.latitude;
    center.value.lng = selectedCityItem.location.longitude;
    address.value = address.value || {};
    address.value.location = address.value.location || {};
    address.value.location.latitude = selectedCityItem.location.latitude
    address.value.location.longitude = selectedCityItem.location.longitude
    showMarker.value = true;
  }
  if(selectedCityItem["@id"]){
    address.value.city = selectedCityItem["@id"]
  }
  mapKey.value += 1;
};
async function getCountry() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
    ...countryFilters.value,
    groups: ["country:list"],
  });
}
getCountry();
const onMapClick = (event: google.maps.MouseEvent) => {
  center.value.lat = event.latLng.lat();
  center.value.lng = event.latLng.lng();
  showMarker.value = true;
  mapKey.value += 1;
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