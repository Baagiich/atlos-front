<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable>
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable>
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
import Form from "@/components/consignor/ConsignorForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useConsignorDeleteStore } from "@/store/consignor/delete";
import { useConsignorUpdateStore } from "@/store/consignor/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useConsignorCreateStore } from "@/store/consignor/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Consignor } from "@/types/consignor";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const consignorCreateStore = useConsignorCreateStore();
const { created } = storeToRefs(consignorCreateStore);

const consignorDeleteStore = useConsignorDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(consignorDeleteStore);

const consignorUpdateStore = useConsignorUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(consignorUpdateStore);

useMercureItem({
  store: consignorUpdateStore,
  deleteStore: consignorDeleteStore,
  redirectRouteName: "ConsignorList",
});

await consignorUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Consignor) {
  await consignorUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    consignorUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await consignorDeleteStore.deleteItem(item?.value);

  router.push({ name: "ConsignorList" });
}

onBeforeUnmount(() => {
  consignorUpdateStore.$reset();
  consignorCreateStore.$reset();
  consignorDeleteStore.$reset();
});
</script>
