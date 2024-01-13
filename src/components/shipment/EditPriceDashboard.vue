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
    <v-row>
      <v-col class="driver-request-shipment-code" md="12">
        {{ t("driverrequest.shipmentCode") }}{{ item?.shipmentCode }}
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <ShipmentInfo :info="false" />
      </v-col>
      <v-col cols="12" sm="6" md="6" class="container">
        <div class="bid-attention">
          {{ t("shipment.bidAttention") }}
        </div>
      </v-col>
      <v-col md="12">
        <ShipmentDeals
          :shipmentid="targetEntityId"
          :currency="item?.currency || 'MNT'"
        />
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentShowStore } from "@/store/shipment/show";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentInfo from "@/components/shipment/ShipmentInfo.vue";
import ShipmentDeals from "@/components/shipment/ShipmentDeals.vue";
const { t } = useI18n();
const route = useRoute();
const breadcrumb = useBreadcrumb();

const shipmentShowStore = useShipmentShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { error: deleteError } = storeToRefs(shipmentDeleteStore);
const targetEntityId = ref(getTargetEntityId());
useMercureItem({
  store: shipmentShowStore,
  deleteStore: shipmentDeleteStore,
  redirectRouteName: "ShipmentList",
});

await shipmentShowStore.retrieve(decodeURIComponent(route.params.id as string));
function getTargetEntityId(): number {
  const routeParam = route.params.id;
  if (Array.isArray(routeParam)) {
    throw new Error("Route param is an array");
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
.container {
  position: relative;
}

.bid-attention {
  position: absolute;
  bottom: 35px;
  left: 16px;
  font-size: 18px;
  width: 450px;
}
</style>
