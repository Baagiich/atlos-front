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
          :color="currentColorState"
          size="small"
          class="ma-2"
          @click="handleButtonClick(item)"
        >
          {{ t(currentTextState) }}
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
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder, Filters } from "@/types/list";
import { useRequestsCreateStore } from "@/store/requests/create";
import * as apiToken from "@/utils/apiToken";
import type { Requests } from "@/types/requests";
import { useRoute } from "vue-router";
import { useVehicleRequestsListStore } from "@/store/driverrequests/vehiclelist";
import { RequestsCodeType } from "@/types/requests_code_type";
import { RequestsType } from "@/types/requests_type";
import { useVehicleListStore } from "@/store/vehicle/list";
import { Vehicle } from "@/types/vehicle";

const props = defineProps(["targetEntityId"]);
const targetEntityId = ref(props.targetEntityId);
const { t } = useI18n();
const breadcrumb = useBreadcrumb();
const route = useRoute();

const vehicleDeleteStore = useVehicleDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(vehicleDeleteStore);

const vehicleListStore = useVehicleListStore();
const { items, totalItems, error, isLoading } = storeToRefs(vehicleListStore);

const requestsVehicleListStore = useVehicleRequestsListStore();
const {
  items: requestVehicleItems,
  totalItems: requestVehicleTotalItems,
  error: requestError,
  isLoading: requsetisLoading,
} = storeToRefs(requestsVehicleListStore);

const requestsCreateStore = useRequestsCreateStore();
const { created } = storeToRefs(requestsCreateStore);
const page = ref("1");
const filters: Ref<Filters> = ref({});
filters.value.plateNumber = "";
const order = ref({});
const filtersVehicleRequest: Ref<Filters> = ref({
  fromUser: apiToken.getDecodedToken().iri,
  targetEntityId: targetEntityId.value,
  code: RequestsCodeType.SHIPPER_TO_VEHICLE,
});
const BUTTON_STATES = {
  CREATE: "create",
  PENDING: "pending",
  APPROVED: "approved",
};
let currentButtonState = ref(BUTTON_STATES.CREATE);
let currentColorState = ref("secondary");
let currentTextState = ref("driverrequest.sendRequest");
var showCreateVehicleAlert = ref(false);

async function handleButtonClick(item: Vehicle) {
  switch (currentButtonState.value) {
    case BUTTON_STATES.CREATE:
      sendRequestToVehicle(item);
      break;
    default:
      break;
  }
}
async function sendRequest() {
  await vehicleListStore.getItems({
    page: page.value,
    order: order.value,
    ...(filters.value || {}),
  });
}
async function checkRequest() {
  await requestsVehicleListStore.getVehicleRequests({
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
    if (requestVehicleItems.value[0].type == RequestsType.REJECTED) {
      currentButtonState.value = BUTTON_STATES.CREATE;
      currentColorState.value = "secondary";
      currentTextState.value = "driverrequest.sendRequest";
    } else if (requestVehicleItems.value[0].type == RequestsType.PENDING) {
      currentButtonState.value = BUTTON_STATES.PENDING;
      currentColorState.value = "blue-grey-lighten-2";
      currentTextState.value = "driverrequest.pending";
    } else if (requestVehicleItems.value[0].type == RequestsType.APPROVED) {
      currentButtonState.value = BUTTON_STATES.APPROVED;
      currentColorState.value = "light-green-lighten-2";
      currentTextState.value = "driverrequest.approved";
    }
  } else {
    currentButtonState.value = BUTTON_STATES.CREATE;
    currentColorState.value = "secondary";
    currentTextState.value = "driverrequest.sendRequest";
  }
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
  vehicleListStore.$reset();
  requestsVehicleListStore.$reset();
});
function sendRequestToVehicle(item: Vehicle) {
  createVehicleRequests(createVehicleRequest(item));
}
function createVehicleRequest(item: Vehicle): Requests {
  const req: Requests = {
    fromUser: apiToken.getDecodedToken().iri,
    toUser: item.shipper["@id"],
    code: RequestsCodeType.SHIPPER_TO_VEHICLE,
    type: RequestsType.PENDING,
    targetEntityId: targetEntityId.value,
    params: {
      iri: item["@id"],
      plateNumber: item.plateNumber,
    },
  };
  return req;
}
</script>
