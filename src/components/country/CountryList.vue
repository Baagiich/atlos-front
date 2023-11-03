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
          @show="goToShowPage(item.raw)"
          @update="goToUpdatePage(item.raw)"
          @delete="deleteItem(item.raw)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'CountryShow', params: { id: item.raw['@id'] } }"
        >
          {{ item.raw["@id"] }}
        </router-link>
      </template>

      <template #item.states="{ item }">
        <template v-if="router.hasRoute('StateShow')">
          <router-link
            v-for="state in item.raw.states"
            :to="{ name: 'StateShow', params: { id: state } }"
            :key="state"
          >
            {{ state }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="state in item.raw.states" :key="state">
            {{ state }}
          </p>
        </template>
      </template>
      <template #item.updatedAt="{ item }">
        {{ formatDateTime(item.raw.updatedAt) }}
      </template>
            <template #item.createdAt="{ item }">
        {{ formatDateTime(item.raw.createdAt) }}
      </template>
          </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCountryListStore } from "@/store/country/list";
import { useCountryDeleteStore } from "@/store/country/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Country } from "@/types/country";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const countryDeleteStore = useCountryDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(countryDeleteStore);

const countryListStore = useCountryListStore();
const { items, totalItems, error, isLoading } = storeToRefs(countryListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await countryListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({ store: countryListStore, deleteStore: countryDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("country.isoCode3"),
    key: "isoCode3",
    sortable: false,
  },
  {
    title: t("country.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("country.states"),
    key: "states",
    sortable: false,
  },
  {
    title: t("country.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("country.createdAt"),
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


function goToShowPage(item: Country) {
  router.push({
    name: "CountryShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "CountryCreate",
  });
}

function goToUpdatePage(item: Country) {
  router.push({
    name: "CountryUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Country) {
  await countryDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  countryDeleteStore.$reset();
});
</script>
