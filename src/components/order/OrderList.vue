<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
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
        <v-btn
          v-if="!item?.paidAt"
          color="success"
          size="small"
          class="ma-2"
          @click="goToCheckoutPage(item)"
          >{{ $t("order.pay") }}</v-btn
        >
      </template>
      <template #item.status="{ item }">
        <v-chip v-if="item?.paidAt" color="green">{{
          $t("order.paid")
        }}</v-chip>
        <v-chip v-else>{{ $t("order.unpaid") }}</v-chip>
      </template>
      <template #item.description="{ item }">
        <span v-if="item.item?.details.paymentType">
          {{ $t(item.item?.details.paymentType) }}
        </span>
        <span v-else>
          {{ item?.item?.product.name }}
        </span>
      </template>
      <template #item.paidAt="{ item }">
        {{ formatDateTime(item.paidAt) }}
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useOrderListStore } from "@/store/order/list";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/order/OrderFilter.vue";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { Order } from "@/types/order";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const orderListStore = useOrderListStore();
const { items, totalItems, error, isLoading } = storeToRefs(orderListStore);

const page = ref(1);
const filters: Ref<Filters> = ref({});
const ordering = ref({});

async function sendRequest() {
  await orderListStore.getItems({
    page: +page.value,
    groups: [
      "order_item:list",
      "product:read",
      "shipment:list",
      "money:read",
      "order:read",
    ],
    order: ordering.value,
    ...filters.value,
  });
}

sendRequest();

const headers = [
  { title: t("id"), key: "@id" },
  {
    title: t("order.number"),
    key: "number",
    sortable: true,
  },
  {
    title: t("shipment.shipmentCode"),
    key: "item.shipment.shipmentCode",
    sortable: false,
  },
  {
    title: t("order.totalAmount"),
    key: "totalAmount.amount",
    sortable: false,
  },
  {
    title: t("currency.title"),
    key: "totalAmount.currency",
    sortable: false,
  },
  {
    title: t("status"),
    key: "status",
    sortable: false,
  },
  {
    title: t("description"),
    key: "description",
    sortable: false,
  },
  {
    title: t("order.paidAt"),
    key: "paidAt",
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
  ordering.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}

function onSendFilter() {
  sendRequest();
}

function resetFilter() {
  filters.value = {};

  sendRequest();
}

function goToCheckoutPage(item: Order) {
  router.push({
    name: "OrderCheckout",
    params: { orderNumber: item["number"] },
  });
}
</script>
