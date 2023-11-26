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
      <v-btn v-if="showCreateBtn"
        color="secondary"
        size="small"
        class="ma-2"
        @click="sendRequestToDriver(item)"
      >
      {{ t("driverrequest.sendRequest") }}
      </v-btn>
      <v-btn v-if="showFendingBtn"
        color="blue-grey-lighten-2"
        size="small"
        class="ma-2"
      >
      {{ t("driverrequest.pending") }}
      </v-btn>
      <v-btn v-if="showApproveBtn"
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
import { useRequestsListStore } from "@/store/requests/list";
import { RequestsCodeType } from "@/types/requests_code_type";
import { RequestsType } from "@/types/requests_type";

const { t } = useI18n();
const breadcrumb = useBreadcrumb();
const route = useRoute();

const adminuserDeleteStore = useAdminUserDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(adminuserDeleteStore);

const adminuserListStore = useAdminUserListStore();
const { items, totalItems, error, isLoading } = storeToRefs(adminuserListStore);

const requestsListStore = useRequestsListStore();
const { items:requestItems, totalItems:requestTotalItems, error: requestError, isLoading: requsetisLoading } = storeToRefs(requestsListStore);

const requestsCreateStore = useRequestsCreateStore();
const { created } = storeToRefs(requestsCreateStore);
const page = ref("1");
const filters: Ref<Filters> = ref({});
  filters.value.email = ""
const order = ref({});
const filtersRequest: Ref<Filters> = ref({fromUser:apiToken.getDecodedToken().iri , targetEntityId: getTargetEntityId() , code: RequestsCodeType.SHIPPER_TO_DRIVER});
var showCreateAlert = ref(false);
var showCreateBtn = ref(false);
var showFendingBtn = ref(false);
var showApproveBtn = ref(false);
async function sendRequest() {
  await adminuserListStore.getItems({
    page: page.value,
    order: order.value,
    ...(filters.value || {}),
  });
}
async function checkRequest() {
  await requestsListStore.getItems({
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
  if( requestTotalItems.value != 0){
    showCreateBtn = ref(false);
    if(requestItems.value[0].type == RequestsType.REJECTED)
  {
    showCreateBtn = ref(true);
  }
  if(requestItems.value[0].type == RequestsType.PENDING)
  {
    showFendingBtn = ref(true);
  }
  if(requestItems.value[0].type == RequestsType.APPROVED)
  {
    showApproveBtn = ref(true);
  }
  }else{
    showCreateBtn = ref(true);
  }
  sendRequest();

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
    targetEntityId: getTargetEntityId()
  }
  return req;
}
function getTargetEntityId(): number {
  const routeParam = route.params.id
  const targetEntityId = routeParam.replace('/api/shipments/','')
  return +targetEntityId
}
</script>