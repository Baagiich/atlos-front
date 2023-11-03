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
import Form from "@/components/city/CityForm.vue";
import { useCityCreateStore } from "@/store/city/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { City } from "@/types/city";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const cityCreateStore = useCityCreateStore();
const { created, isLoading, violations, error } = storeToRefs(cityCreateStore);

async function create(item: City) {
  await cityCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "CityUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  cityCreateStore.$reset();
});
</script>
