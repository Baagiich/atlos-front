<template>
  <v-row>
    <v-col cols="12" sm="4" md="4">
      <v-text-field
      v-model="filters.email"
        :label="$t('driverrequest.pickDriver')"
        type="string"
        @change="onSendFilter"
      />
    </v-col>
  </v-row>
  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" closable="true">
      {{ error }}
    </v-alert>

    <v-alert v-if="showCreateAlert" type="error" class="mb-4" closable="true">
      {{ $t('driverrequest.totalItemError') }}
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
      <template #item.lastName="{ item }">
        {{ item.lastName }}
      </template>
      <template #item.firstName="{ item }">
        {{ item.firstName }}
      </template>
      <template #item.email="{ item }">
        {{ item.email }}
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
import { useAdminUserListStore } from "@/store/adminuser/list";
import { useAdminUserDeleteStore } from "@/store/adminuser/delete";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder, Filters } from "@/types/list";
import type { AdminUser } from "@/types/adminuser";
import { useRequestsCreateStore } from "@/store/requests/create";
import * as apiToken from "@/utils/apiToken";
import type { Requests } from "@/types/requests";
import { useRoute } from "vue-router";
import { useDriverRequestsListStore } from "@/store/driverrequests/driverlist";
import { RequestsCodeType } from "@/types/requests_code_type";
import { RequestsType } from "@/types/requests_type";

const props = defineProps(['targetEntityId']);
const targetEntityId = ref(props.targetEntityId)
const { t } = useI18n();
const breadcrumb = useBreadcrumb();
const route = useRoute();

const adminuserDeleteStore = useAdminUserDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(adminuserDeleteStore);

const adminuserListStore = useAdminUserListStore();
const { items, totalItems, error, isLoading } = storeToRefs(adminuserListStore);

const requestsListStore = useDriverRequestsListStore();
const { items:requestItems, totalItems:requestTotalItems, error: requestError, isLoading: requsetisLoading } = storeToRefs(requestsListStore);

const requestsCreateStore = useRequestsCreateStore();
const { created } = storeToRefs(requestsCreateStore);
const page = ref("1");
const filters: Ref<Filters> = ref({});
  filters.value.email = ""
const order = ref({});
const filtersRequest: Ref<Filters> = ref({fromUser:apiToken.getDecodedToken().iri , targetEntityId: targetEntityId.value , code: RequestsCodeType.SHIPPER_TO_DRIVER});
  const BUTTON_STATES = {
  CREATE: 'create',
  PENDING: 'pending',
  APPROVED: 'approved',
};
let currentButtonState = ref(BUTTON_STATES.CREATE);
let currentColorState = ref('secondary');
let currentTextState = ref('driverrequest.sendRequest');
var showCreateAlert = ref(false);

async function handleButtonClick(item: AdminUser) {
  switch (currentButtonState.value) {
    case BUTTON_STATES.CREATE:
    sendRequestToDriver(item);
      break;
    default:
      break;
  }
}
async function sendRequest() {
  await adminuserListStore.getItems({
    page: page.value,
    order: order.value,
    ...(filters.value || {}),
  });
}
async function checkRequest() {
  await requestsListStore.getDriverRequests({
    page: page.value,
    order: order.value,
    ...filtersRequest.value,
    groups: ["requests:detail"],
  });
}
useMercureList({
  store: adminuserListStore,
  deleteStore: adminuserDeleteStore,
});

async function toggleBtns() {
  if (requestTotalItems.value != 0) {
    if (requestItems.value[0].type == RequestsType.REJECTED) {
      currentButtonState.value = BUTTON_STATES.CREATE;
      currentColorState.value = 'secondary'
      currentTextState.value = 'driverrequest.sendRequest';
    } else if (requestItems.value[0].type == RequestsType.PENDING) {
      currentButtonState.value = BUTTON_STATES.PENDING;
      currentColorState.value = 'blue-grey-lighten-2'
      currentTextState.value = 'driverrequest.pending';
    } else if (requestItems.value[0].type == RequestsType.APPROVED) {
      currentButtonState.value = BUTTON_STATES.APPROVED;
      currentColorState.value = 'light-green-lighten-2'
      currentTextState.value = 'driverrequest.approved';
    }
  } else {
    currentButtonState.value = BUTTON_STATES.CREATE;
    currentColorState.value = 'secondary'
      currentTextState.value = 'driverrequest.sendRequest';
  }
}
async function setup() {
  await checkRequest();

  if (requestTotalItems.value >= 1) {
    filters.value.email = requestItems.value[0].toUser.email;
    await sendRequest();
  }
  await toggleBtns();
}

setup();
const headers = [
{
    title: t("adminuser.lastName"),
    key: "lastName",
    sortable: false,
  },
  {
    title: t("adminuser.firstName"),
    key: "firstName",
    sortable: false,
  },
  {
    title: t("adminuser.email"),
    key: "email",
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
async function createRequests(item: Requests) {
  if(requestTotalItems.value >= 1)
  {
    showCreateAlert = ref(true);
    sendRequest();
    return
  }
  await requestsCreateStore.create(item);

  if (!created?.value) {
    return;
  }
  setup()
}

onBeforeUnmount(() => {
  adminuserDeleteStore.$reset();
  adminuserListStore.$reset();
  requestsListStore.$reset();
});
function sendRequestToDriver(item: AdminUser) {
  createRequests(createRequest(item));
}
function createRequest(item: AdminUser): Requests {
  const req: Requests = {
    fromUser: apiToken.getDecodedToken().iri,
    toUser: item["@id"],
    code: RequestsCodeType.SHIPPER_TO_DRIVER,
    type: RequestsType.PENDING,
    targetEntityId: targetEntityId.value
  }
  return req;
}
</script>