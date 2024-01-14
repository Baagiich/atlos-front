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
            <ShipmentInfo :info="true" />
            <shipment-location-list
              @selected="emitSelected"
            ></shipment-location-list>
            <v-btn
              class="ma-4"
              color="deep-purple-accent-4"
              @click="goToFilesPage"
            >
              {{ $t("shipment.seeShipmentImages") }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <GoogleMap
              class="rounded-xl overflow-hidden"
              :api-key="GOOGLE_MAPS_API_KEY"
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
                      padding: 5px;
                      border-radius: 5px;
                      background: #00000080;
                    "
                  >
                    <div style="font-weight: 700">
                      <span
                        class="mdi mdi-map-marker-multiple"
                        style="color: #34ff40; font-size: 24px"
                      ></span>
                    </div>
                    <div class="text-white">
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
                      padding: 5px;
                      border-radius: 5px;
                      background: #00000080;
                    "
                  >
                    <div style="font-weight: 700">
                      <span
                        class="mdi mdi-map-marker-multiple"
                        style="color: red; font-size: 24px"
                      ></span>
                    </div>
                    <div class="text-white">
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
          :api-key="GOOGLE_MAPS_API_KEY"
          style="width: 100%; height: 500px; margin: 10px"
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
              anchorPoint: 'BOTTOM_CENTER',
            }"
          >
            <div style="text-align: center">
              <div
                style="
                  font-size: 1rem;
                  background: #00000080;
                  padding: 5px;
                  border-radius: 5px;
                "
              >
                <div style="font-weight: 700">
                  <span
                    class="mdi mdi-map-marker-multiple"
                    style="color: #34ff40; font-size: 24px"
                  ></span>
                </div>
                <div class="text-white">
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
              :key="i"
              :options="{ position: location }"
            />
          </MarkerCluster>
          <CustomMarker
            :options="{
              position: {
                lat: retrieved?.toAddress.location.latitude,
                lng: retrieved?.toAddress.location.longitude,
              },
              anchorPoint: 'LEFT_CENTER',
            }"
          >
            <div style="text-align: center">
              <div
                style="
                  font-size: 1rem;
                  padding: 5px;
                  border-radius: 5px;
                  background: #00000080;
                "
              >
                <div style="font-weight: 700">
                  <span
                    class="mdi mdi-map-marker-multiple"
                    style="color: red; font-size: 24px"
                  ></span>
                </div>
                <div class="text-white">
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
import { computed, ref } from "vue";
import ShipmentLocationList from "./ShipmentLocationList.vue";
import {
  GoogleMap,
  Marker,
  MarkerCluster,
  CustomMarker,
} from "vue3-google-map";
import { useShipmentDetailStore } from "@/store/shipment/detail";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import ShipmentDetailState from "./ShipmentState.vue";
import { GOOGLE_MAPS_API_KEY } from "@/utils/config";
import ShipmentInfo from "@/components/shipment/ShipmentInfo.vue";

const tab = ref(null);
const selectedLocation = ref(null);
const router = useRouter();
const shipmentDetailStore = useShipmentDetailStore();
const { retrieved } = storeToRefs(shipmentDetailStore);

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

function goToFilesPage() {
  router.push({
    name: "ShipmentDetailFiles",
  });
}
</script>
