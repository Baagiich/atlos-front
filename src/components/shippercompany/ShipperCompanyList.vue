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
          @show="goToShowPage(item)"
          @update="goToUpdatePage(item)"
          @delete="deleteItem(item)"
        />
      </template>

      <template #item.@id="{ item }">
        <router-link
          :to="{ name: 'ShipperCompanyShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipperCompanyListStore } from "@/store/shippercompany/list";
import { useShipperCompanyDeleteStore } from "@/store/shippercompany/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { ShipperCompany } from "@/types/shippercompany";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shippercompanyDeleteStore = useShipperCompanyDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(shippercompanyDeleteStore);

const shippercompanyListStore = useShipperCompanyListStore();
const { items, totalItems, error, isLoading } = storeToRefs(shippercompanyListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await shippercompanyListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({ store: shippercompanyListStore, deleteStore: shippercompanyDeleteStore });

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("shippercompany.firstname"),
    key: "firstname",
    sortable: false,
  },
  {
    title: t("shippercompany.lastname"),
    key: "lastname",
    sortable: false,
  },
  {
    title: t("shippercompany.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("shippercompany.email"),
    key: "email",
    sortable: false,
  },
  {
    title: t("shippercompany.register"),
    key: "register",
    sortable: false,
  },
  {
    title: t("shippercompany.phoneNumber"),
    key: "phoneNumber",
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


function goToShowPage(item: ShipperCompany) {
  router.push({
    name: "ShipperCompanyShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ShipperCompanyCreate",
  });
}

function goToUpdatePage(item: ShipperCompany) {
  router.push({
    name: "ShipperCompanyUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: ShipperCompany) {
  await shippercompanyDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  shippercompanyDeleteStore.$reset();
});
</script>
