<template>
  <ShipmentDetailState></ShipmentDetailState>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
      <v-tab :value="1">{{ $t("shipment.seeShipmentList") }}</v-tab>
      <v-tab :value="2">{{ $t("shipment.seeShipmentListOnMap") }}</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :key="1" :value="1">
        <v-row>
          <v-col cols="6">
            <shipment-location-list
              @selected="emitSelected"
            ></shipment-location-list>
            <v-btn @click="goToFilesPage">
              {{ $t("shipment.seeShipmentImages") }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <GoogleMap
              class="rounded-xl overflow-hidden"
              :api-key="googleMapsApiKey"
              style="width: 100%; height: 500px; margin: 10px"
              :zoom="5"
              :center="{
                lat: retrieved?.fromAddress.location.latitude,
                lng: retrieved?.fromAddress.location.longitude,
              }"
            >
              <CustomMarker
                :options="{
                  position: {
                    lat: retrieved?.fromAddress.location.latitude,
                    lng: retrieved?.fromAddress.location.longitude,
                  },
                }"
              >
                <div style="text-align: center">
                  <div
                    style="
                      font-size: 1rem;
                      border: 1px solid black;
                      padding: 5px;
                      border-radius: 5px;
                    "
                  >
                    <div style="font-weight: 700">
                      {{ retrieved?.fromAddress.street }}
                    </div>
                    <div>
                      {{
                        retrieved?.fromAddress.city.name +
                        ", " +
                        retrieved?.fromAddress.city.state.country.name
                      }}
                    </div>
                  </div>
                </div>
              </CustomMarker>
              <Marker
                v-if="selectedLocation"
                :options="{
                  position: selectedLocation,
                }"
              >
              </Marker>
              <CustomMarker
                :options="{
                  position: {
                    lat: retrieved?.toAddress.location.latitude,
                    lng: retrieved?.toAddress.location.longitude,
                  },
                }"
              >
                <div style="text-align: center">
                  <div
                    style="
                      font-size: 1rem;
                      border: 1px solid black;
                      padding: 5px;
                      border-radius: 5px;
                    "
                  >
                    <div style="font-weight: 700">
                      {{ retrieved?.toAddress.street }}
                    </div>
                    <div>
                      {{
                        retrieved?.toAddress.city.name +
                        ", " +
                        retrieved?.toAddress.city.state.country.name
                      }}
                    </div>
                  </div>
                </div>
              </CustomMarker>
            </GoogleMap>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :key="2" :value="2">
        <GoogleMap
          class="rounded-xl overflow-hidden"
          :api-key="googleMapsApiKey"
          style="width: 100%; height: 400px; margin: 10px"
          :zoom="4.5"
          :center="{
            lat: retrieved?.fromAddress.location.latitude,
            lng: retrieved?.fromAddress.location.longitude,
          }"
        >
          <CustomMarker
            :options="{
              position: {
                lat: retrieved?.fromAddress.location.latitude,
                lng: retrieved?.fromAddress.location.longitude,
              },
            }"
          >
            <div style="text-align: center">
              <div
                style="
                  font-size: 1rem;
                  border: 1px solid black;
                  padding: 5px;
                  border-radius: 5px;
                "
              >
                <div style="font-weight: 700">
                  {{ retrieved?.fromAddress.street }}
                </div>
                <div>
                  {{
                    retrieved?.fromAddress.city.name +
                    ", " +
                    retrieved?.fromAddress.city.state.country.name
                  }}
                </div>
              </div>
            </div>
          </CustomMarker>
          <MarkerCluster>
            <Marker
              v-for="(location, i) in locations"
              :options="{ position: location }"
              :key="i"
            />
          </MarkerCluster>
          <CustomMarker
            :options="{
              position: {
                lat: retrieved?.toAddress.location.latitude,
                lng: retrieved?.toAddress.location.longitude,
              },
            }"
          >
            <div style="text-align: center">
              <div
                style="
                  font-size: 1rem;
                  border: 1px solid black;
                  padding: 5px;
                  border-radius: 5px;
                "
              >
                <div style="font-weight: 700">
                  {{ retrieved?.toAddress.street }}
                </div>
                <div>
                  {{
                    retrieved?.toAddress.city.name +
                    ", " +
                    retrieved?.toAddress.city.state.country.name
                  }}
                </div>
              </div>
            </div>
          </CustomMarker>
        </GoogleMap>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import ShipmentLocationList from "./ShipmentLocationList.vue";
import {
  GoogleMap,
  Marker,
  MarkerCluster,
  CustomMarker,
} from "vue3-google-map";
import { useShipmentDetailStore } from "@/store/shipment/detail";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { ShipmentState } from "@/types/shipment_state";
import ShipmentDetailState from "./ShipmentState.vue";
import * as enumHelper from "@/utils/enumHelper";
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const tab = ref(null);
const selectedLocation = ref(null);
const router = useRouter();
const shipmentDetailStore = useShipmentDetailStore();
const { retrieved, isLoading, error, totalItems } =
  storeToRefs(shipmentDetailStore);
const route = useRoute();

const locations = computed(() => {
  return retrieved && retrieved.value?.deviceLocation
    ? retrieved.value.deviceLocation.map((obj) => ({
        lat: obj.coordinate.latitude,
        lng: obj.coordinate.longitude,
      }))
    : [];
});
async function emitSelected(value: any) {
  selectedLocation.value = value;
}

function goToFilesPage(){
  router.push({
    name: "ShipmentDetailFiles",
  });
}
</script>
