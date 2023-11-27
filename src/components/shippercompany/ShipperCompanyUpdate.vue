<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      closable="true"
    >
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/shippercompany/ShipperCompanyForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useShipperCompanyDeleteStore } from "@/store/shippercompany/delete";
import { useShipperCompanyUpdateStore } from "@/store/shippercompany/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipperCompanyCreateStore } from "@/store/shippercompany/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipperCompany } from "@/types/shippercompany";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shippercompanyCreateStore = useShipperCompanyCreateStore();
const { created } = storeToRefs(shippercompanyCreateStore);

const shippercompanyDeleteStore = useShipperCompanyDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  shippercompanyDeleteStore,
);

const shippercompanyUpdateStore = useShipperCompanyUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(shippercompanyUpdateStore);

useMercureItem({
  store: shippercompanyUpdateStore,
  deleteStore: shippercompanyDeleteStore,
  redirectRouteName: "ShipperCompanyList",
});

await shippercompanyUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: ShipperCompany) {
  await shippercompanyUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    shippercompanyUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await shippercompanyDeleteStore.deleteItem(item?.value);

  router.push({ name: "ShipperCompanyList" });
}

onBeforeUnmount(() => {
  shippercompanyUpdateStore.$reset();
  shippercompanyCreateStore.$reset();
  shippercompanyDeleteStore.$reset();
});
</script>
