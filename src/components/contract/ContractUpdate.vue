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
      :closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      :closable="true"
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
import Form from "@/components/contract/ContractForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useContractDeleteStore } from "@/store/contract/delete";
import { useContractUpdateStore } from "@/store/contract/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useContractCreateStore } from "@/store/contract/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Contract } from "@/types/contract";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contractCreateStore = useContractCreateStore();
const { created } = storeToRefs(contractCreateStore);

const contractDeleteStore = useContractDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(contractDeleteStore);

const contractUpdateStore = useContractUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(contractUpdateStore);

useMercureItem({
  store: contractUpdateStore,
  deleteStore: contractDeleteStore,
  redirectRouteName: "ContractList",
});

await contractUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Contract) {
  await contractUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    contractUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await contractDeleteStore.deleteItem(item?.value);

  router.push({ name: "ContractList" });
}

onBeforeUnmount(() => {
  contractUpdateStore.$reset();
  contractCreateStore.$reset();
  contractDeleteStore.$reset();
});
</script>
