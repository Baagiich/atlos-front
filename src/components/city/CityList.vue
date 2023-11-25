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
    <v-alert v-if="mercureDeleted" type="success" class="mb-4" closable="true">
      {{ $t("itemDeletedByAnotherUser", [mercureDeleted["@id"]]) }}
    </v-alert>

    <v-alert v-if="error" type="error" class="mb-4" closable="true">
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
          :to="{ name: 'CityShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.state="{ item }">
        <router-link
          v-if="router.hasRoute('StateShow')"
          :to="{ name: 'StateShow', params: { id: item.state } }"
        >
          {{ item.state }}
        </router-link>

        <p v-else>
          {{ item.state }}
        </p>
      </template>
      <template #item.addresses="{ item }">
        <template v-if="router.hasRoute('AddressShow')">
          <router-link
            v-for="address in item.addresses"
            :to="{ name: 'AddressShow', params: { id: address } }"
            :key="address"
          >
            {{ address }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="address in item.addresses" :key="address">
            {{ address }}
          </p>
        </template>
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
import { useCityListStore } from "@/store/city/list";
import { useCityDeleteStore } from "@/store/city/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import DataFilter from "@/components/common/DataFilter.vue";
import Filter from "@/components/city/CityFilter.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Filters, VuetifyOrder } from "@/types/list";
import type { City } from "@/types/city";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const cityDeleteStore = useCityDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(cityDeleteStore);

const cityListStore = useCityListStore();
const { items, totalItems, error, isLoading } = storeToRefs(cityListStore);

const page = ref("1");
const filters: Ref<Filters> = ref({});
const order = ref({});

async function sendRequest() {
  await cityListStore.getItems({
    page: page.value,
    order: order.value,
    ...filters.value,
  });
}

useMercureList({ store: cityListStore, deleteStore: cityDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("city.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("city.state"),
    key: "state",
    sortable: false,
  },
  {
    title: t("city.capital"),
    key: "capital",
    sortable: false,
  },
  {
    title: t("city.addresses"),
    key: "addresses",
    sortable: false,
  },
  {
    title: t("city.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("city.createdAt"),
    key: "createdAt",
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

function resetFilter() {
  filters.value = {};

  sendRequest();
}

function goToShowPage(item: City) {
  router.push({
    name: "CityShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "CityCreate",
  });
}

function goToUpdatePage(item: City) {
  router.push({
    name: "CityUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: City) {
  await cityDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  cityDeleteStore.$reset();
});
</script>
