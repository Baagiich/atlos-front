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
import Form from "@/components/address/AddressForm.vue";
import { useAddressCreateStore } from "@/store/address/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Address } from "@/types/address";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const addressCreateStore = useAddressCreateStore();
const { created, isLoading, violations, error } = storeToRefs(addressCreateStore);

async function create(item: Address) {
  await addressCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "AddressUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  addressCreateStore.$reset();
});
</script>
