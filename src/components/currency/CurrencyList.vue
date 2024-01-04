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
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
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
      <template #item.actions="{ item }">
        <ActionCell
          :actions="['update', 'delete']"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCurrencyListStore } from "@/store/currency/list";
import { useCurrencyDeleteStore } from "@/store/currency/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Currency } from "@/types/currency";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const currencyListStore = useCurrencyListStore();
const currencyDeleteStore = useCurrencyDeleteStore();
const { items, totalItems, error, isLoading } = storeToRefs(currencyListStore);
const { deleted } = storeToRefs(currencyDeleteStore);

const page = ref(1);
const order = ref({});

async function sendRequest() {
  await currencyListStore.getItems({
    page: +page.value,
    order: order.value,
  });
}

sendRequest();

const headers = [
  { title: "#", key: "id" },
  {
    title: t("currency.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("currency.code"),
    key: "code",
    sortable: false,
  },
  {
    title: t("actions"),
    key: "actions",
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

function goToCreatePage() {
  router.push({
    name: "CurrencyCreate",
  });
}

function goToUpdatePage(item: Currency) {
  router.push({
    name: "CurrencyUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Currency) {
  await currencyDeleteStore.deleteItem(item);
  sendRequest();
}
</script>
