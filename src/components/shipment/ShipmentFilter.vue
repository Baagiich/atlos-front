<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.state"
          :label="$t('shipment.state')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.loadAt"
          :label="$t('shipment.loadAt')"
          type="dateTime"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.unloadAt"
          :label="$t('shipment.unloadAt')"
          type="dateTime"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { Filters } from "@/types/list";

const props = defineProps<{
  values: Filters;
}>();

const item = toRef(props, "values");
</script>
