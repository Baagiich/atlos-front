<template>
    <v-container fluid>
      <v-alert v-if="error || deleteError" type="error" class="mb-4" closable="true">
        {{ error || deleteError }}
      </v-alert>
  
      <v-table class="shipment-destination-table" v-if="item">
        <thead>
          <tr>
           <td colspan="2">{{ "Ачилтын мэдээлэл" }}</td>
          </tr>
        </thead>
  
        <tbody>
          <tr>
            <td>
              {{ $t("shipment.fromAddress") }}
            </td>
  
            <td>
              <p>
                {{ item.fromAddress.city.name }}, {{ item.fromAddress.city.state.country.name }}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              {{ $t("shipment.toAddress") }}
            </td>
  
            <td>
              <p>
              {{ item.toAddress.city.name }}, {{ item.toAddress.city.state.country.name }}
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
  import { useI18n } from "vue-i18n";
  import { storeToRefs } from "pinia";
  import Loading from "@/components/common/Loading.vue";
  import { useMercureItem } from "@/composables/mercureItem";
  import { useShipmentDeleteStore } from "@/store/shipment/delete";
  import { useShipmentShowStore } from "@/store/shipment/show";
  import { formatDateInput } from "@/utils/date";
  
  const { t } = useI18n();
  
  const shipmentShowStore = useShipmentShowStore();
  const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);
  
  const shipmentDeleteStore = useShipmentDeleteStore();
  const { deleted, error: deleteError } = storeToRefs(shipmentDeleteStore);
  
  useMercureItem({
    store: shipmentShowStore,
    deleteStore: shipmentDeleteStore,
  });
  
  
  
  onBeforeUnmount(() => {
    shipmentShowStore.$reset();
  });
  </script>
<style lang="scss">
.shipment-destination-table {
  background: #F8F8F8;
  thead{
      text-align: center;
      font-weight: bold;
    }
    td:nth-child(2){
      text-align: right;
    }
}
</style>
