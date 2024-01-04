<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="filters.shipment"
          :label="$t('shipmentload.shipment')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { Filters } from "@/types/list";
import { toRef } from "vue";

const props = defineProps<{
  values: Filters;
}>();

const filters = toRef(props, "values");
</script>
