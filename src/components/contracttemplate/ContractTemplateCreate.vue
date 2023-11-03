<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{ error }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/contracttemplate/ContractTemplateForm.vue";
import { useContractTemplateCreateStore } from "@/store/contracttemplate/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ContractTemplate } from "@/types/contracttemplate";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const contracttemplateCreateStore = useContractTemplateCreateStore();
const { created, isLoading, violations, error } = storeToRefs(contracttemplateCreateStore);

async function create(item: ContractTemplate) {
  await contracttemplateCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "ContractTemplateUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  contracttemplateCreateStore.$reset();
});
</script>
