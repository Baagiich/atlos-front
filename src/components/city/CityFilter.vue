<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.name"
          :label="$t('city.name')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { City } from "@/types/city";

const props = defineProps<{
  values: City;
}>();

const item = toRef(props, "values");
</script>
