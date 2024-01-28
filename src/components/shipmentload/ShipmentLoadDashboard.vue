<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <v-row>
      <v-col cols="12" sm="6" md="12">
        <v-stepper v-model="currentStep">
          <template #default="">
            <v-stepper-header>
              <template v-for="n in steps" :key="`${n}-step`">
                <v-stepper-item
                  :complete="currentStep > n"
                  :step="`Step {{ n }}`"
                  :value="n"
                ></v-stepper-item>
              </template>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item :key="step" :value="steps[0]">
                <ShipmentForm ref="shipmentFormRef" />
              </v-stepper-window-item>

              <v-stepper-window-item :key="step" :value="steps[1]">
                <ShipmentLocationCreateForm
                  ref="fromAddressFormRef"
                  :address="fromAddress"
                  :title="t('shipmentload.loadLocation')"
                />
                <ShipmentLocationCreateForm
                  ref="toAddressFormRef"
                  :address="toAddress"
                  :title="t('shipmentload.unloadLocation')"
                />
                <v-row>
                  <v-col cols="3">
                    <ShipmentCreateDatePicker
                      ref="datePickerFormRef"
                      :title="t('shipmentload.loadDate')"
                    />
                  </v-col>
                </v-row>
                <ShipmentPriceForm ref="priceFormRef" />
              </v-stepper-window-item>
              <v-stepper-window-item
                v-if="item?.loadType !== ShipmentLoadType.DANGEROUS"
                :key="step"
                :value="steps[2]"
              >
                <h3 class="load-title">
                  {{ $t("shipmentload.loadTitle") }}
                </h3>
                <v-row>
                  <v-col cols="9">
                    <div v-if="totalCreatedLoads > 0">
                      <div
                        v-for="createdLoad in createdLoads"
                        :key="createdLoad['@id']"
                      >
                        <ShipmentLoadUpdate
                          :key="createdLoad['@id']"
                          :item="createdLoad"
                          @updatelist="getCreatedLoads"
                        />
                      </div>
                    </div>

                    <ShipmentLoadCreate
                      v-if="item && item.loadType === ShipmentLoadType.REGULAR"
                      :created-shipment-id="createdShipmentId"
                      @updatelist="getCreatedLoads"
                    />
                  </v-col>
                  <v-col cols="3">
                    <ShipmentLoadSum
                      v-if="item && item.loadType === ShipmentLoadType.REGULAR"
                      ref="loadSumRef"
                      :created-loads="createdLoads"
                      :patch-shipment-item="patchShipmentItem"
                      :currency="item.currency"
                      :sticky="true"
                      style="position: sticky"
                    />
                    <VehicleForm
                      v-if="item && item.loadType === ShipmentLoadType.REGULAR"
                      ref="vehicleFormRef"
                    />
                  </v-col>
                </v-row>
              </v-stepper-window-item>
              <v-stepper-window-item
                :key="step"
                :value="
                  item?.loadType === ShipmentLoadType.DANGEROUS
                    ? steps[2]
                    : steps[3]
                "
              >
                <ShipmentDocumentType
                  ref="documentTypeRef"
                  :item-documents="itemDocuments"
                  :load-type="item?.loadType"
                />
              </v-stepper-window-item>
            </v-stepper-window>
            <v-stepper-actions
              :next-text="t('shipmentload.continue')"
              :prev-text="t('back')"
              :disabled="false"
              @click:prev="prev"
              @click:next="next"
            >
            </v-stepper-actions>
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ShipmentForm from "@/components/shipmentload/ShipmentCreateForm.vue";
import ShipmentLoadCreate from "@/components/shipmentload/ShipmentLoadCreate.vue";
import ShipmentLoadSum from "@/components/shipmentload/ShipmentLoadSum.vue";
import ShipmentLocationCreateForm from "./ShipmentLocationCreateForm.vue";
import ShipmentCreateDatePicker from "./ShipmentCreateDatePicker.vue";
import ShipmentDocumentType from "./ShipmentDocumentType.vue";
import { Address } from "@/types/address";
import { useCreateNewShipmentStore } from "@/store/shipmentload/newshipment";
import { useCreateNewDocumentStore } from "@/store/shipmentload/newdocument";
import { usepatchShipmentStore } from "@/store/shipmentload/patchshipment";
import ShipmentPriceForm from "./ShipmentPriceForm.vue";
import { useAddressCreateStore } from "@/store/address/create";
import { useShipmentCreateStore } from "@/store/shipment/create";
import ShipmentLoadUpdate from "@/components/shipmentload/ShipmentLoadUpdate.vue";
import { useShipmentLoadListStore } from "@/store/shipmentload/list";
import { Filters } from "@/types/list";
import router from "@/router";
import { useDocumentTypeCreateStore } from "@/store/documenttype/create";
import { useAddressUpdateStore } from "@/store/address/update";
import { useShipmentUpdateStore } from "@/store/shipment/update";
import { ShipmentType } from "@/types/shipment_type";
import { ShipmentLoadType } from "@/types/shipment_load_type";
import VehicleForm from "@/components/shipmentload/VehicleForm.vue";

const { t } = useI18n();
const breadcrumb = useBreadcrumb();
const currentStep = ref(1);
const step = ref(1);
const steps = ref([1, 2, 3, 4]);
const isUpdateShipment = ref(false);
const fromAddress: Ref<Address> = ref({});
const toAddress: Ref<Address> = ref({});
const newShipmentStore = useCreateNewShipmentStore();
const { item } = storeToRefs(newShipmentStore);
const newDocumentStore = useCreateNewDocumentStore();
const { items: itemDocuments } = storeToRefs(newDocumentStore);
const patchShipmentStore = usepatchShipmentStore();
const { item: patchShipmentItem } = storeToRefs(patchShipmentStore);
const addressCreateStore = useAddressCreateStore();
const { created, isLoading, error } = storeToRefs(addressCreateStore);
const createdShipmentId: Ref<string> = ref("");
const shipmentCreateStore = useShipmentCreateStore();
const { created: createdShipment } = storeToRefs(shipmentCreateStore);
const documentTypeCreateStore = useDocumentTypeCreateStore();
const addressUpdateStore = useAddressUpdateStore();
const { updated: formAddressUpdated } = storeToRefs(addressUpdateStore);
const shipmentUpdateStore = useShipmentUpdateStore();
const shipmentFormRef = ref();
const fromAddressFormRef = ref();
const toAddressFormRef = ref();
const priceFormRef = ref();
const secondStepResult1 = ref(false);
const secondStepResult2 = ref(false);
const secondStepResult3 = ref(false);
const secondStepResult4 = ref(false);
const loadSumRef = ref();
const vehicleFormRef = ref();
const datePickerFormRef = ref();
const documentTypeRef = ref();
async function saveShipment() {
  await saveFromAddress();
  await saveToAddress();
  await createNewShipment();
  await getCreatedLoads();
}
async function updateShipment() {
  await updateAddress();
  await updateShipmentValue();
}
async function emitFinish() {
  await saveFromAddress();
  await saveToAddress();
  await createNewShipment();
  gotoList();
}
async function emitFinishDocument() {
  await saveDocuments();
  gotoList();
}

function gotoList() {
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
      fromAddress.value.id = created?.value["@id"];
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
      toAddress.value.id = created?.value["@id"];
    }
  }
}
async function updateAddress() {
  if (!item || !item.value) {
    return;
  }
  if (fromAddress.value || toAddress.value) {
    await addressUpdateStore.update(fromAddress.value);
    if (formAddressUpdated?.value) {
      item.value.fromAddress = formAddressUpdated?.value["@id"];
    }
    await addressUpdateStore.update(toAddress.value);
    if (formAddressUpdated?.value) {
      item.value.toAddress = formAddressUpdated?.value["@id"];
    }
  }
}
async function saveDocuments() {
  if (itemDocuments?.value?.length === 0) {
    return;
  }
  if (itemDocuments?.value) {
    itemDocuments.value.forEach(async (document) => {
      document.shipment = createdShipmentId.value;
      await documentTypeCreateStore.create(document);
    });
  }
}
async function createNewShipment() {
  if (!item || !item.value) {
    return;
  }
  await shipmentCreateStore.create(item.value);
  if (createdShipment?.value && createdShipment?.value["@id"]) {
    createdShipmentId.value = createdShipment?.value["@id"];
    patchShipmentItem.value.id = createdShipment?.value.id;
    item.value.id = createdShipment?.value.id;
  }
}
async function updateShipmentValue() {
  if (!item || !item.value) {
    return;
  }
  await shipmentUpdateStore.update(item.value);
}
const shipmentloadListStore = useShipmentLoadListStore();
const { items: createdLoads, totalItems: totalCreatedLoads } = storeToRefs(
  shipmentloadListStore,
);
const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});
async function getCreatedLoads() {
  if (createdShipmentId.value) {
    filters.value.shipment = createdShipmentId.value;
    await shipmentloadListStore.getItems({
      page: +page.value,
      order: order.value,
      ...filters.value,
    });
  }
}
async function saveSumOnShipment() {
  await shipmentUpdateStore.update(patchShipmentItem.value);
}

watch(
  () => item?.value?.loadType,
  () => {
    if (item?.value?.loadType === ShipmentLoadType.CARGO) {
      steps.value = [1, 2];
    } else if (item?.value?.loadType === ShipmentLoadType.DANGEROUS) {
      steps.value = [1, 2, 3];
      item.value.shipmentType = ShipmentType.SECURE;
    } else {
      steps.value = [1, 2, 3, 4];
      if (item && item.value) item.value.shipmentType = undefined;
    }
  },
);

function prev() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
  if (currentStep.value === 4) {
    gotoList();
  }
}
function addStepper() {
  if (currentStep.value <= steps.value.length) {
    currentStep.value++;
  }
}
async function next() {
  if (currentStep.value === 1) {
    const result = await shipmentFormRef.value.validateForm();
    if (result) {
      addStepper();
    }
  } else if (currentStep.value === 2) {
    secondStepResult1.value = await toAddressFormRef.value.validateForm();
    secondStepResult2.value = await fromAddressFormRef.value.validateForm();
    secondStepResult3.value = await datePickerFormRef.value.validateForm();
    secondStepResult4.value = await priceFormRef.value.validateForm();
    if (
      secondStepResult1.value &&
      secondStepResult2.value &&
      secondStepResult3.value &&
      secondStepResult4.value
    ) {
      if (item?.value?.loadType === 2) {
        await emitFinish();
      } else {
        if (isUpdateShipment.value === false) {
          await saveShipment();
        }
        if (isUpdateShipment.value === true) {
          await updateShipment();
        }
      }
      addStepper();
    }
  } else if (currentStep.value === 3) {
    if (item?.value?.loadType !== ShipmentLoadType.DANGEROUS) {
      const result = await loadSumRef.value.validateForm();
      const vehicleTypeResult = await vehicleFormRef.value.validateForm();
      if (vehicleTypeResult) {
        if (
          patchShipmentItem &&
          patchShipmentItem.value &&
          patchShipmentItem.value.vehicleTypes === undefined
        ) {
          patchShipmentItem.value.vehicleTypes = [...vehicleTypeResult.value];
        }
      }
      if (result) {
        await saveSumOnShipment();
        addStepper();
      }
    } else {
      await documentTypeRef.value.savetoStore();
      await emitFinishDocument();
      addStepper();
    }
  } else if (currentStep.value === 4) {
    await documentTypeRef.value.savetoStore();
    await emitFinishDocument();
    addStepper();
  }
}
</script>
<style lang="scss">
.driver-request-shipment-code {
  text-align: right;
  font-weight: bold;
}
.load-title {
  text-align: center;
  margin: 25px 0;
}
</style>
