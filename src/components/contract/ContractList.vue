<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" :closable="true">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" :closable="true">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>

    <DataFilter @filter="onSendFilter" @reset="resetFilter">
      <template #filter>
        <Filter :values="filters" />
      </template>
    </DataFilter>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['show', 'update', 'delete']"
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'ContractShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.adminUser="{ item }">
        <router-link
          v-if="router.hasRoute('AdminUserShow')"
          :to="{ name: 'AdminUserShow', params: { id: item.adminUser } }"
        >
          {{ item.adminUser }}
        </router-link>

        <p v-else>
          {{ item.adminUser }}
        </p>
      </template>
      <template #item.contractTemplate="{ item }">
        <router-link
          v-if="router.hasRoute('ContractTemplateShow')"
          :to="{
            name: 'ContractTemplateShow',
            params: { id: item.contractTemplate },
          }"
        >
          {{ item.contractTemplate }}
        </router-link>

        <p v-else>
          {{ item.contractTemplate }}
        </p>
      </template>
      <template #item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useContractListStore } from "@/store/contract/list";
import { useContractDeleteStore } from "@/store/contract/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/contract/ContractFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { Contract } from "@/types/contract";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contractDeleteStore = useContractDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(contractDeleteStore);

const contractListStore = useContractListStore();
const { items, totalItems, error, isLoading } = storeToRefs(contractListStore);

const page = ref(1);
const filters: Ref<Filters> = ref({});
const order = ref({});

async function sendRequest() {
  await contractListStore.getItems({
    page: +page.value,
    order: order.value,
    ...filters.value,
  });
}

useMercureList({ store: contractListStore, deleteStore: contractDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("contract.adminUser"),
    key: "adminUser",
    sortable: false,
  },
  {
    title: t("contract.contractTemplate"),
    key: "contractTemplate",
    sortable: false,
  },
  {
    title: t("contract.signed"),
    key: "signed",
    sortable: false,
  },
  {
    title: t("contract.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("contract.createdAt"),
    key: "createdAt",
    sortable: false,
  },
];

function updatePage(newPage: number) {
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

function resetFilter() {
  filters.value = {};

  sendRequest();
}

function goToShowPage(item: Contract) {
  router.push({
    name: "ContractShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ContractCreate",
  });
}

function goToUpdatePage(item: Contract) {
  router.push({
    name: "ContractUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Contract) {
  await contractDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  contractDeleteStore.$reset();
});
</script>
