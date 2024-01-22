<template>
  <v-container fluid>
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
      </tbody>
    </v-table>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentShowStore } from "@/store/shipment/show";
import { formatDateInput } from "@/utils/date";

const shipmentShowStore = useShipmentShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { error: deleteError } = storeToRefs(shipmentDeleteStore);

onBeforeUnmount(() => {
  shipmentShowStore.$reset();
});
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
