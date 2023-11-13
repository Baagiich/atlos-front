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
import Form from "@/components/contract/ContractForm.vue";
import { useContractCreateStore } from "@/store/contract/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Contract } from "@/types/contract";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const contractCreateStore = useContractCreateStore();
const { created, isLoading, violations, error } = storeToRefs(contractCreateStore);

async function create(item: Contract) {
  await contractCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "ContractUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  contractCreateStore.$reset();
});
</script>
