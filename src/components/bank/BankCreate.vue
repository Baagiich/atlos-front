<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{
      error
    }}</v-alert>

    <Form :errors="violations" @submit="create" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/bank/BankForm.vue";
import { useBankCreateStore } from "@/store/bank/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Bank } from "@/types/bank";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const bankCreateStore = useBankCreateStore();
const { created, isLoading, violations, error } = storeToRefs(bankCreateStore);

async function create(item: Bank) {
  await bankCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "BankUpdate",
    params: { id: created?.value?.["@id"] },
  });
}
</script>
