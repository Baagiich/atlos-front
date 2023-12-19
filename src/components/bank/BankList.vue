<template>
  <Toolbar
    :actions="['add']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @add="goToCreatePage"
  />

  <v-container fluid>
    <v-alert v-if="deleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeleted", [deleted["@id"]]) }}
    </v-alert>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">
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
import { useBankListStore } from "@/store/bank/list";
import { useBankDeleteStore } from "@/store/bank/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Bank } from "@/types/bank";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();
const bankListStore = useBankListStore();
const bankDeleteStore = useBankDeleteStore();
const { items, totalItems, error, isLoading } = storeToRefs(bankListStore);
const { deleted } = storeToRefs(bankListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await bankListStore.getItems({
    page: +page.value,
    order: order.value,
  });
}

sendRequest();

const headers = [
  { title: "#", key: "id" },
  {
    title: t("bank.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("bank.nameEn"),
    key: "nameEn",
    sortable: false,
  },
  {
    title: t("bank.code"),
    key: "code",
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

function goToCreatePage() {
  router.push({
    name: "BankCreate",
  });
}

function goToUpdatePage(item: Bank) {
  router.push({
    name: "BankUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Bank) {
  await bankDeleteStore.deleteItem(item);
  sendRequest();
}
</script>
