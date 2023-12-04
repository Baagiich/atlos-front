<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      closable="true"
    >
      {{ error || deleteError }}
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="12">
        <ShipmentForm :disabled="firstStepDisabled" @next-step="emitFirstStep"/>
        <ShipmentLocationCreateForm v-if="secondStepShow" :address = "fromAddress" :title = "t('shipmentload.loadLocation')" />
        <ShipmentLocationCreateForm v-if="secondStepShow" :address = "toAddress" :title = "t('shipmentload.unloadLocation')" />
        <v-row>
      <v-col cols="2">
        <ShipmentCreateDatePicker v-if="secondStepShow" :isStartDate=true :title = "t('shipmentload.loadDate')" />
      </v-col>
      <v-col cols="2">

      <ShipmentCreateDatePicker v-if="secondStepShow" :isStartDate=false :title = "t('shipmentload.unloadDate')"/>
      </v-col>
      </v-row>
      <ShipmentPriceForm v-if="secondStepShow" />
        <ShipmentLoadCreate v-if="thirdStepShow" />
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
// import { useMercureItem } from "@/composables/mercureItem";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentForm from "@/components/shipmentload/ShipmentCreateForm.vue";
import ShipmentLoadCreate from "@/components/shipmentload/ShipmentLoadCreate.vue";
import ShipmentLocationCreateForm from "./ShipmentLocationCreateForm.vue";
import ShipmentCreateDatePicker from "./ShipmentCreateDatePicker.vue";
import { Address } from "@/types/address";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import ShipmentPriceForm from "./ShipmentPriceForm.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

// useMercureItem({
//   store: shipmentShowStore,
//   deleteStore: shipmentDeleteStore,
//   redirectRouteName: "ShipmentList",
// });
const fromAddress: Ref<Address> = ref({});
const toAddress: Ref<Address> = ref({});
  const newShipmentStore = useCreateNewShipmentStore();
const { shipment } = storeToRefs(newShipmentStore);
const firstStepDisabled: Ref<boolean> = ref(false);
const secondStepShow: Ref<boolean> = ref(false);
const thirdStepShow: Ref<boolean> = ref(false);

function emitFirstStep(){
  secondStepShow.value = true;
  firstStepDisabled.value = true;
}
</script>
<style lang="scss">
.driver-request-shipment-code {
  text-align: right;
  font-weight: bold;
}
</style>
