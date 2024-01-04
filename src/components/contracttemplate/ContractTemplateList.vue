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
          :to="{ name: 'ContractTemplateShow', params: { id: item['@id'] } }"
        >
          {{ item["@id"] }}
        </router-link>
      </template>

      <template #item.contracts="{ item }">
        <template v-if="router.hasRoute('ContractShow')">
          <router-link
            v-for="contract in item.contracts"
            :key="contract"
            :to="{ name: 'ContractShow', params: { id: contract } }"
          >
            {{ contract }}

            <br />
          </router-link>
        </template>

        <template v-else>
          <p v-for="contract in item.contracts" :key="contract">
            {{ contract }}
          </p>
        </template>
      </template>
      <template #item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template #item.activeFrom="{ item }">
        {{ formatDateTime(item.activeFrom) }}
      </template>
      <template #item.activeTo="{ item }">
        {{ formatDateTime(item.activeTo) }}
      </template>
      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useContractTemplateListStore } from "@/store/contracttemplate/list";
import { useContractTemplateDeleteStore } from "@/store/contracttemplate/delete";
import Toolbar from "@/components/common/Toolbar.vue";
import ActionCell from "@/components/common/ActionCell.vue";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VuetifyOrder } from "@/types/list";
import type { ContractTemplate } from "@/types/contracttemplate";

const { t } = useI18n();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contracttemplateDeleteStore = useContractTemplateDeleteStore();
const { deleted, mercureDeleted } = storeToRefs(contracttemplateDeleteStore);

const contracttemplateListStore = useContractTemplateListStore();
const { items, totalItems, error, isLoading } = storeToRefs(
  contracttemplateListStore,
);

const page = ref(1);
const order = ref({});

async function sendRequest() {
  await contracttemplateListStore.getItems({
    page: +page.value,
    order: order.value,
  });
}

useMercureList({
  store: contracttemplateListStore,
  deleteStore: contracttemplateDeleteStore,
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
    title: t("contracttemplate.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("contracttemplate.template"),
    key: "template",
    sortable: false,
  },
  {
    title: t("contracttemplate.userType"),
    key: "userType",
    sortable: false,
  },
  {
    title: t("contracttemplate.contracts"),
    key: "contracts",
    sortable: false,
  },
  {
    title: t("contracttemplate.updatedAt"),
    key: "updatedAt",
    sortable: false,
  },
  {
    title: t("contracttemplate.activeFrom"),
    key: "activeFrom",
    sortable: false,
  },
  {
    title: t("contracttemplate.activeTo"),
    key: "activeTo",
    sortable: false,
  },
  {
    title: t("contracttemplate.createdAt"),
    key: "createdAt",
    sortable: false,
  },
  {
    title: t("contracttemplate.active"),
    key: "active",
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

function goToShowPage(item: ContractTemplate) {
  router.push({
    name: "ContractTemplateShow",
    params: { id: item["@id"] },
  });
}

function goToCreatePage() {
  router.push({
    name: "ContractTemplateCreate",
  });
}

function goToUpdatePage(item: ContractTemplate) {
  router.push({
    name: "ContractTemplateUpdate",
    params: { id: item["@id"] },
  });
}

async function deleteItem(item: ContractTemplate) {
  await contracttemplateDeleteStore.deleteItem(item);

  sendRequest();
}

onBeforeUnmount(() => {
  contracttemplateDeleteStore.$reset();
});
</script>
