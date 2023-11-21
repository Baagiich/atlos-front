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
import Form from "@/components/shipmentloadinfos/ShipmentLoadInfosForm.vue";
import { useShipmentLoadInfosCreateStore } from "@/store/shipmentloadinfos/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipmentLoadInfos } from "@/types/shipmentloadinfos";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadinfosCreateStore = useShipmentLoadInfosCreateStore();
const { created, isLoading, violations, error } = storeToRefs(shipmentloadinfosCreateStore);

async function create(item: ShipmentLoadInfos) {
  await shipmentloadinfosCreateStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "ShipmentLoadInfosUpdate", params: { id: created?.value?.["@id"] } });
}

onBeforeUnmount(() => {
  shipmentloadinfosCreateStore.$reset();
});
</script>
