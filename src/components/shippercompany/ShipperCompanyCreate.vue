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
import Form from "@/components/shippercompany/ShipperCompanyForm.vue";
import { useShipperCompanyCreateStore } from "@/store/shippercompany/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipperCompany } from "@/types/shippercompany";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const shippercompanyCreateStore = useShipperCompanyCreateStore();
const { created, isLoading, violations, error } = storeToRefs(
  shippercompanyCreateStore,
);

async function create(item: ShipperCompany) {
  await shippercompanyCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({
    name: "ShipperCompanyUpdate",
    params: { id: created?.value?.["@id"] },
  });
}

onBeforeUnmount(() => {
  shippercompanyCreateStore.$reset();
});
</script>
