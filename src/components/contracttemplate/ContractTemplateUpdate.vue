<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable="true">
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable="true">
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
import Form from "@/components/contracttemplate/ContractTemplateForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useContractTemplateDeleteStore } from "@/store/contracttemplate/delete";
import { useContractTemplateUpdateStore } from "@/store/contracttemplate/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useContractTemplateCreateStore } from "@/store/contracttemplate/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ContractTemplate } from "@/types/contracttemplate";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contracttemplateCreateStore = useContractTemplateCreateStore();
const { created } = storeToRefs(contracttemplateCreateStore);

const contracttemplateDeleteStore = useContractTemplateDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(contracttemplateDeleteStore);

const contracttemplateUpdateStore = useContractTemplateUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(contracttemplateUpdateStore);

useMercureItem({
  store: contracttemplateUpdateStore,
  deleteStore: contracttemplateDeleteStore,
  redirectRouteName: "ContractTemplateList",
});

await contracttemplateUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: ContractTemplate) {
  await contracttemplateUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    contracttemplateUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await contracttemplateDeleteStore.deleteItem(item?.value);

  router.push({ name: "ContractTemplateList" });
}

onBeforeUnmount(() => {
  contracttemplateUpdateStore.$reset();
  contracttemplateCreateStore.$reset();
  contracttemplateDeleteStore.$reset();
});
</script>
