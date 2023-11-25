<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      <v-text-field
        v-model="filters.plateNumber"
        :label="$t('driverrequest.pickVehicle')"
        type="string"
        @change="onSendFilter"
      />
    </v-col>
  </v-row>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable>
      {{ error }}
    </v-alert>

    <v-alert
      v-if="showCreateVehicleAlert"
      type="error"
      class="mb-4"
      closable="true"
    >
      {{ $t("driverrequest.totalItemError") }}
    </v-alert>
    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.plateNumber="{ item }">
        {{ item.plateNumber }}
      </template>
      <template #item.vehicleType="{ item }">
        {{ item.vehicleType }}
      </template>
      <template #item.vehicleCapacity="{ item }">
        {{ item.vehicleCapacity }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="showCreateVehicleBtn"
          color="secondary"
          size="small"
          class="ma-2"
          @click="sendRequestToVehicle(item)"
        >
          {{ t("driverrequest.sendRequest") }}
        </v-btn>
        <v-btn
          v-if="showFendingVehicleBtn"
          color="blue-grey-lighten-2"
          size="small"
          class="ma-2"
        >
          {{ t("driverrequest.pending") }}
        </v-btn>
        <v-btn
          v-if="showApproveVehicleBtn"
          color="light-green-lighten-2"
          size="small"
          class="ma-2"
        >
          {{ t("driverrequest.approved") }}
        </v-btn>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useVehicleDeleteStore } from "@/store/vehicle/delete";
import { useMercureList } from "@/composables/mercureList";
import type { VuetifyOrder, Filters } from "@/types/list";
import { useRequestsCreateStore } from "@/store/requests/create";
import * as apiToken from "@/utils/apiToken";
import type { Requests } from "@/types/requests";
import { useRoute } from "vue-router";
import { useRequestsListStore } from "@/store/requests/list";
import { RequestsCodeType } from "@/types/requests_code_type";
import { RequestsType } from "@/types/requests_type";
import { useVehicleListStore } from "@/store/vehicle/list";
import { Vehicle } from "@/types/vehicle";

const { t } = useI18n();
const route = useRoute();

const vehicleDeleteStore = useVehicleDeleteStore();

const vehicleListStore = useVehicleListStore();
const { items, totalItems, error, isLoading } = storeToRefs(vehicleListStore);

const requestsVehicleListStore = useRequestsListStore();
const { items: requestVehicleItems, totalItems: requestVehicleTotalItems } =
  storeToRefs(requestsVehicleListStore);

const requestsCreateStore = useRequestsCreateStore();
const { created } = storeToRefs(requestsCreateStore);
const page = ref("1");
const filters: Ref<Filters> = ref({});
filters.value.plateNumber = "";
const order = ref({});
const filtersVehicleRequest: Ref<Filters> = ref({
  fromUser: apiToken.getDecodedToken().iri,
  targetEntityId: getTargetEntityId(),
  code: RequestsCodeType.SHIPPER_TO_VEHICLE,
});
var showCreateVehicleAlert = ref(false);
var showCreateVehicleBtn = ref(false);
var showFendingVehicleBtn = ref(false);
var showApproveVehicleBtn = ref(false);
async function sendRequest() {
  await vehicleListStore.getItems({
    page: page.value,
    order: order.value,
    ...(filters.value || {}),
  });
}
async function checkRequest() {
  await requestsVehicleListStore.getItems({
    page: page.value,
    order: order.value,
    ...filtersVehicleRequest.value,
    groups: ["requests:detail"],
  });
}
useMercureList({
  store: vehicleListStore,
  deleteStore: vehicleDeleteStore,
});
async function toggleBtns() {
  if (requestVehicleTotalItems.value != 0) {
    showCreateVehicleBtn = ref(false);
    if (requestVehicleItems.value[0].type == RequestsType.REJECTED) {
      showCreateVehicleBtn = ref(true);
    }
    if (requestVehicleItems.value[0].type == RequestsType.PENDING) {
      showFendingVehicleBtn = ref(true);
    }
    if (requestVehicleItems.value[0].type == RequestsType.APPROVED) {
      showApproveVehicleBtn = ref(true);
    }
  } else {
    showCreateVehicleBtn = ref(true);
  }
  sendRequest();
}
async function setup() {
  await checkRequest();

  if (requestVehicleTotalItems.value >= 1) {
    filters.value = {};
    filters.value.plateNumber = requestVehicleItems.value[0].params.plateNumber;
    await sendRequest();
  }
  await toggleBtns();
}

setup();
const headers = [
  {
    title: t("driverrequest.plateNumber"),
    key: "plateNumber",
    sortable: false,
  },
  {
    title: t("driverrequest.vehicleType"),
    key: "vehicleType",
    sortable: false,
  },
  {
    title: t("driverrequest.vehicleCapacity"),
    key: "vehicleCapacity",
    sortable: false,
  },
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
];

function updatePage(newPage: string) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  order.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}

function onSendFilter() {
  sendRequest();
}
async function createVehicleRequests(item: Requests) {
  if (requestVehicleTotalItems.value >= 1) {
    showCreateVehicleAlert = ref(true);
    sendRequest();
    return;
  }
  await requestsCreateStore.create(item);

  if (!created?.value) {
    return;
  }
  setup();
}

onBeforeUnmount(() => {
  vehicleDeleteStore.$reset();
});
function sendRequestToVehicle(item: Vehicle) {
  createVehicleRequests(createVehicleRequest(item));
}
function createVehicleRequest(item: Vehicle): Requests {
  const req: Requests = {
    fromUser: apiToken.getDecodedToken().iri,
    toUser: item.shipper,
    code: RequestsCodeType.SHIPPER_TO_VEHICLE,
    type: RequestsType.PENDING,
    targetEntityId: getTargetEntityId(),
    params: {
      plateNumber: item.plateNumber,
    },
  };
  return req;
}
function getTargetEntityId(): number {
  const routeParam = route.params.id;
  const targetEntityId = routeParam.replace("/api/shipments/", "");
  return +targetEntityId;
}
</script>
