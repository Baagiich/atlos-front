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
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/consignor/ConsignorForm.vue";
import { useConsignorCreateStore } from "@/store/consignor/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Consignor } from "@/types/consignor";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const consignorCreateStore = useConsignorCreateStore();
const { created, isLoading, violations, error } =
  storeToRefs(consignorCreateStore);

async function create(item: Consignor) {
  await consignorCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "ConsignorUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  consignorCreateStore.$reset();
});
</script>
