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
import Form from "@/components/country/CountryForm.vue";
import { useCountryCreateStore } from "@/store/country/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Country } from "@/types/country";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const countryCreateStore = useCountryCreateStore();
const { created, isLoading, violations, error } = storeToRefs(countryCreateStore);

async function create(item: Country) {
  await countryCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "CountryUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  countryCreateStore.$reset();
});
</script>
