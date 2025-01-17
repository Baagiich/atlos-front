<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      :closable="true"
    >
      {{ error || deleteError }}
    </v-alert>
    <v-row v-if="item">
      <v-col class="driver-request-shipment-code" md="12">
        {{ t("driverrequest.shipmentCode") }}{{ item.shipmentCode }}
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <ShipmentInfo />
      </v-col>
      <v-col md="12">
        <ShipmentLoadInfos :shipmentid="item['@id']" />
      </v-col>
      <v-col md="6">
        <DriverRequest :target-entity-id="getTargetEntityId()" />
      </v-col>
      <v-col md="6">
        <VehicleRequest :target-entity-id="getTargetEntityId()" />
      </v-col>
      <v-col md="12">
        <BidRequest :currency="item.currency" :shipmentid="item['@id']" />
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentShowStore } from "@/store/shipment/show";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentInfo from "@/components/driverrequest/ShipmentInfo.vue";
import ShipmentLoadInfos from "@/components/driverrequest/ShipmentLoadInfos.vue";
import DriverRequest from "./DriverRequest.vue";
import VehicleRequest from "./VehicleRequest.vue";
import BidRequest from "./BidRequest.vue";
const { t } = useI18n();
const route = useRoute();
const breadcrumb = useBreadcrumb();

const shipmentShowStore = useShipmentShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { error: deleteError } = storeToRefs(shipmentDeleteStore);
useMercureItem({
  store: shipmentShowStore,
  deleteStore: shipmentDeleteStore,
  redirectRouteName: "ShipmentList",
});

await shipmentShowStore.retrieve(decodeURIComponent(route.params.id as string));
function getTargetEntityId(): number {
  const routeParam = route.params.id;
  if (Array.isArray(routeParam)) {
    return 0;
  }
  const targetEntityId = routeParam.replace("/api/shipments/", "");
  return +targetEntityId;
}

onBeforeUnmount(() => {
  shipmentShowStore.$reset();
});
</script>
<style lang="scss">
.driver-request-shipment-code {
  text-align: right;
  font-weight: bold;
}
</style>
