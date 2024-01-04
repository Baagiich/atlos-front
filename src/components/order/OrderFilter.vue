<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.number"
          :label="$t('order.number')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.status"
          :label="$t('status')"
          type="string"
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
