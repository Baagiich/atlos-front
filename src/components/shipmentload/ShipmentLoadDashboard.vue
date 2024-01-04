<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="12">
        <ShipmentForm
          :disabled="firstStepDisabled"
          @next-step="emitFirstStep"
        />
        <ShipmentLocationCreateForm
          v-if="secondStepShow"
          :disabled="secondStepDisabled"
          :address="fromAddress"
          :title="t('shipmentload.loadLocation')"
        />
        <ShipmentLocationCreateForm
          v-if="secondStepShow"
          :disabled="secondStepDisabled"
          :address="toAddress"
          :title="t('shipmentload.unloadLocation')"
        />
        <v-row>
          <v-col cols="2">
            <ShipmentCreateDatePicker
              v-if="secondStepShow"
              :disabled="secondStepDisabled"
              :isstartdate="true"
              :title="t('shipmentload.loadDate')"
            />
          </v-col>
          <v-col cols="2">
            <ShipmentCreateDatePicker
              v-if="secondStepShow"
              :disabled="secondStepDisabled"
              :isstartdate="false"
              :title="t('shipmentload.unloadDate')"
            />
          </v-col>
        </v-row>
        <ShipmentPriceForm
          v-if="secondStepShow"
          :disabled="secondStepDisabled"
          @second-step="emitSecondStep"
          @finish="emitFinish"
        />
        <div v-if="totalCreatedLoads > 0">
          <div v-for="createdLoad in createdLoads" :key="createdLoad['@id']">
            <ShipmentLoadUpdate
              v-if="thirdStepShow"
              :item="createdLoad"
              @updatelist="getCreatedLoads"
            />
          </div>
        </div>
        <ShipmentLoadCreate
          v-if="thirdStepShow && item && item.loadType === 1"
          :created-shipment-id="createdShipmentId"
          @updatelist="getCreatedLoads"
        />
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentForm from "@/components/shipmentload/ShipmentCreateForm.vue";
import ShipmentLoadCreate from "@/components/shipmentload/ShipmentLoadCreate.vue";
import ShipmentLocationCreateForm from "./ShipmentLocationCreateForm.vue";
import ShipmentCreateDatePicker from "./ShipmentCreateDatePicker.vue";
import { Address } from "@/types/address";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import ShipmentPriceForm from "./ShipmentPriceForm.vue";
import { useAddressCreateStore } from "@/store/address/create";
import { useShipmentCreateStore } from "@/store/shipment/create";
import ShipmentLoadUpdate from "@/components/shipmentload/ShipmentLoadUpdate.vue";
import { useShipmentLoadListStore } from "@/store/shipmentload/list";
import { Filters } from "@/types/list";
import router from "@/router";

const { t } = useI18n();
const breadcrumb = useBreadcrumb();

const fromAddress: Ref<Address> = ref({});
const toAddress: Ref<Address> = ref({});
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const firstStepDisabled: Ref<boolean> = ref(false);
const secondStepDisabled: Ref<boolean> = ref(false);
const secondStepShow: Ref<boolean> = ref(false);
const thirdStepShow: Ref<boolean> = ref(false);
const addressCreateStore = useAddressCreateStore();
const { created, isLoading, error } = storeToRefs(addressCreateStore);
const createdShipmentId: Ref<string> = ref("");
const shipmentCreateStore = useShipmentCreateStore();
const { created: createdShipment } = storeToRefs(shipmentCreateStore);

function emitFirstStep() {
  secondStepShow.value = true;
  firstStepDisabled.value = true;
}
async function emitSecondStep() {
  await saveFromAddress();
  await saveToAddress();
  await createNewShipment();
  await getCreatedLoads();
}
async function emitFinish() {
  await saveFromAddress();
  await saveToAddress();
  await createNewShipment();
  await gotoList();
}
async function gotoList() {
  router.push({
    name: "ShipmentList",
  });
}
async function saveFromAddress() {
  if (!item || !item.value) {
    return;
  }
  if (fromAddress.value) {
    await addressCreateStore.create(fromAddress.value);
    if (created?.value) {
      item.value.fromAddress = created?.value["@id"];
    }
  }
}
async function saveToAddress() {
  if (!item || !item.value) {
    return;
  }
  if (toAddress.value) {
    await addressCreateStore.create(toAddress.value);
    if (created?.value) {
      item.value.toAddress = created?.value["@id"];
    }
  }
}
async function createNewShipment() {
  if (!item || !item.value) {
    return;
  }
  await shipmentCreateStore.create(item.value);
  if (createdShipment?.value && createdShipment?.value["@id"]) {
    createdShipmentId.value = createdShipment?.value["@id"];
    secondStepDisabled.value = true;
    thirdStepShow.value = true;
  }
}
const shipmentloadListStore = useShipmentLoadListStore();
const { items: createdLoads, totalItems: totalCreatedLoads } = storeToRefs(
  shipmentloadListStore,
);
const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});
async function getCreatedLoads() {
  filters.value.shipment = createdShipmentId.value;
  await shipmentloadListStore.getItems({
    page: +page.value,
    order: order.value,
    ...filters.value,
  });
}
</script>
<style lang="scss">
.driver-request-shipment-code {
  text-align: right;
  font-weight: bold;
}
</style>
