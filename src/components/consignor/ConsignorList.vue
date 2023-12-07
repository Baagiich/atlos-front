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
          :to="{ name: 'ConsignorShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.mediaobject="{ item }">
        <router-link
          v-if="router.hasRoute('MediaObjectShow')"
          :to="{ name: 'MediaObjectShow', params: { id: item.mediaobject } }"
        >
          {{ item.mediaobject }}
        </router-link>

        <p v-else>
          {{ item.mediaobject }}
        </p>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useConsignorListStore } from "@/store/consignor/list";
import { useConsignorDeleteStore } from "@/store/consignor/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { Consignor } from "@/types/consignor";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const consignorDeleteStore = useConsignorDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(consignorDeleteStore);

const consignorListStore = useConsignorListStore();
const { items, totalItems, error, isLoading } = storeToRefs(consignorListStore);

const page = ref("1");
const order = ref({});

async function sendRequest() {
  await consignorListStore.getItems({
    page: page.value,
    order: order.value,
  });
}

useMercureList({
  store: consignorListStore,
  deleteStore: consignorDeleteStore,
});

sendRequest();

const headers = [
  {
    title: t("actions"),
    key: "actions",
    sortable: false,
  },
  { title: t("id"), key: "@id" },
  {
    title: t("consignor.firstName"),
    key: "firstName",
    sortable: false,
  },
  {
    title: t("consignor.lastName"),
    key: "lastName",
    sortable: false,
  },
  {
    title: t("consignor.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("consignor.email"),
    key: "email",
    sortable: false,
  },
  {
    title: t("consignor.phoneNumber"),
    key: "phoneNumber",
    sortable: false,
  },
  {
    title: t("consignor.register"),
    key: "register",
    sortable: false,
  },
  {
    title: t("consignor.certificate"),
    key: "certificate",
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

function goToShowPage(item: Consignor) {
  router.push({
    name: "ConsignorShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ConsignorCreate",
  });
}

function goToUpdatePage(item: Consignor) {
  router.push({
    name: "ConsignorUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: Consignor) {
  await consignorDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  consignorDeleteStore.$reset();
});
</script>
