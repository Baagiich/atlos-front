<template>
  <div>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      :closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

    <v-table v-if="item" class="shipment-destination-table">
      <thead>
        <tr>
          <td colspan="2">{{ $t("shipment.info") }}</td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {{ $t("driverrequest.shipmentCode") }}
          </td>
          <td>
            <p>{{ item.shipmentCode }},</p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.fromAddress") }}
          </td>
          <td>
            <p>
              {{ item.fromAddress.city.name }},
              {{ item.fromAddress.city.state.country.name }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.toAddress") }}
          </td>

          <td>
            <p>
              {{ item.toAddress.city.name }},
              {{ item.toAddress.city.state.country.name }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.loadAt") }}
          </td>

          <td>
            {{ formatDateInput(item.loadAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.unloadAt") }}
          </td>

          <td>
            {{ formatDateInput(item.unloadAt) }}
          </td>
        </tr>
        <tr></tr>
      </tbody>
    </v-table>
    <!-- <v-rov>
      <v-col>
        <v-btn class="ma-2" color="red" size="small">{{
          $t("shipment.cancelShipment")
        }}</v-btn>
        <v-btn class="ma-2" variant="outlined" color="blue" size="small">{{
          $t("shipment.editShipment")
        }}</v-btn>
      </v-col>
    </v-rov> -->
    <v-rov>
      <v-col>
        <v-btn class="ma-2" color="green" size="small" @click="startShipment">{{
          $t("shipment.startShipment")
        }}</v-btn>
      </v-col>
    </v-rov>
  </div>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentShowStore } from "@/store/shipment/show";
import { formatDateInput } from "@/utils/date";
import { useShipmentPatchStore } from "@/store/shipment/patch";
import { ShipmentAction } from "@/types/shipmentaction";
import { useRoute } from "vue-router";

defineProps<{
  info?: boolean;
}>();
const shipmentShowStore = useShipmentShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { error: deleteError } = storeToRefs(shipmentDeleteStore);
const shipmentPatchStore = useShipmentPatchStore();
const route = useRoute();
const shipmentId = ref();
if (route.params) {
  shipmentId.value = route.params.id;
}
onBeforeUnmount(() => {
  shipmentShowStore.$reset();
});
async function startShipment() {
  await shipmentPatchStore.doAction(
    +shipmentId.value.replace("/api/shipments/", ""),
    ShipmentAction.DRIVER_LOADED,
  );
}
</script>
<style lang="scss">
.shipment-destination-table {
  background: #f8f8f8;
  thead {
    text-align: center;
    font-weight: bold;
  }
  td:nth-child(2) {
    text-align: right;
  }
}
</style>
