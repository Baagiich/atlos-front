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
import Form from "@/components/currency/CurrencyForm.vue";
import { useCurrencyCreateStore } from "@/store/currency/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Currency } from "@/types/currency";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const currencyCreateStore = useCurrencyCreateStore();
const { created, isLoading, violations, error } =
  storeToRefs(currencyCreateStore);

async function create(item: Currency) {
  await currencyCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "CurrencyUpdate",
    params: { id: created?.value?.["@id"] },
  });
}
</script>
