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

                <!-- <v-divider v-if="n !== steps" :key="n"></v-divider> -->
              </template>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item :key="step" :value="steps[0]">
                <ShipmentForm />
              </v-stepper-window-item>

              <v-stepper-window-item :key="step" :value="steps[1]">
                <ShipmentLocationCreateForm
                  :address="fromAddress"
                  :title="t('shipmentload.loadLocation')"
                />
                <ShipmentLocationCreateForm
                  :address="toAddress"
                  :title="t('shipmentload.unloadLocation')"
                />
                <v-row>
                  <v-col cols="3">
                    <ShipmentCreateDatePicker
                      :title="t('shipmentload.loadDate')"
                    />
                  </v-col>
                </v-row>
                <ShipmentPriceForm @finish="emitFinish" />
              </v-stepper-window-item>

              <v-stepper-window-item :key="step" :value="steps[2]">
                <h3 class="load-title">
                  {{ $t("shipmentload.loadTitle") }}
                </h3>

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
                  v-if="item && item.loadType === 1"
                  :created-shipment-id="createdShipmentId"
                  @updatelist="getCreatedLoads"
                />
                <br />
                <ShipmentLoadSum
                  v-if="item && item.loadType === 1 && totalCreatedLoads > 0"
                  :created-loads="createdLoads"
                  :patch-shipment-item="patchShipmentItem"
                  :currency="item.currency"
                />
              </v-stepper-window-item>
              <v-stepper-window-item :key="step" :value="steps[3]">
                <ShipmentDocumentType
                  :item-documents="itemDocuments"
                  :save-store="saveStore"
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
import { useShipmentPatchStore } from "@/store/shipment/patch";
import ShipmentLoadUpdate from "@/components/shipmentload/ShipmentLoadUpdate.vue";
import { useShipmentLoadListStore } from "@/store/shipmentload/list";
import { Filters } from "@/types/list";
import router from "@/router";
import { useDocumentTypeCreateStore } from "@/store/documenttype/create";
import { useAddressUpdateStore } from "@/store/address/update";
import { useShipmentUpdateStore } from "@/store/shipment/update";
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
const shipmentPatchStore = useShipmentPatchStore();
const { updated: patchShipment } = storeToRefs(shipmentPatchStore);
const documentTypeCreateStore = useDocumentTypeCreateStore();
const { created: documentCreated } = storeToRefs(documentTypeCreateStore);
const addressUpdateStore = useAddressUpdateStore();
const { updated: formAddressUpdated } = storeToRefs(addressUpdateStore);
const shipmentUpdateStore = useShipmentUpdateStore();
const { updated: shipmentUpdated } = storeToRefs(shipmentUpdateStore);
const saveStore = ref(false);

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
  await gotoList();
}
async function emitFinishDocument() {
  await saveDocuments();
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
      if (documentCreated?.value) {
        console.log(documentCreated?.value);
      }
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
    isUpdateShipment.value = true;
    item.value.id = createdShipment?.value.id;
  }
}
async function updateShipmentValue() {
  if (!item || !item.value) {
    return;
  }
  await shipmentUpdateStore.update(item.value);
  if (shipmentUpdated?.value) {
    console.log(shipmentUpdated?.value);
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
async function saveSumOnShipment() {
  await shipmentUpdateStore.update(patchShipmentItem.value);
  if (patchShipment?.value) {
    console.log("shipment patched");
  }
}

watch(
  () => item?.value?.loadType,
  () => {
    if (item?.value?.loadType === 2) {
      steps.value = [1, 2];
    } else {
      steps.value = [1, 2, 3, 4];
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

async function next() {
  if (currentStep.value < steps.value.length) {
    currentStep.value++;
  }
  console.log("nextstep:", currentStep.value);
  if (currentStep.value === 3) {
    if (isUpdateShipment.value === false) {
      await saveShipment();
    }
    if (isUpdateShipment.value === true) {
      await updateShipment();
    }
  }
  if (currentStep.value === 4) {
    await saveSumOnShipment();
  }
  if (currentStep.value === 1) {
    // 2 alhamtai bolson uchir butsaad 1 ruu usrehed shiopmentiig shalgav
    if (item?.value?.loadType === 2) {
      await emitFinish();
    }
    saveStore.value = true;
    await emitFinishDocument();
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
