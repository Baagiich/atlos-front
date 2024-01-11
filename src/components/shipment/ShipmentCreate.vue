<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{
      error
    }}</v-alert>

    <v-stepper :items="['Step 1', 'Step 2', 'Step 3', 'Step 4']">
      <template #item.1>
        <v-card title="Step One" flat>...</v-card>
      </template>

      <template #item.2>
        <v-card title="Step Two" flat>...</v-card>
      </template>

      <template #item.3>
        <v-card title="Step Three" flat>...</v-card>
      </template>
      <template #item.4>
        <v-card title="Step Three" flat>...</v-card>
      </template>
    </v-stepper>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useShipmentCreateStore } from "@/store/shipment/create";
import { useBreadcrumb } from "@/composables/breadcrumb";

const breadcrumb = useBreadcrumb();

const shipmentCreateStore = useShipmentCreateStore();
const { isLoading, error } = storeToRefs(shipmentCreateStore);

onBeforeUnmount(() => {
  shipmentCreateStore.$reset();
});
</script>
