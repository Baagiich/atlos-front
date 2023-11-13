<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.adminUser"
          :label="$t('contract.adminUser')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { Contract } from "@/types/contract";

const props = defineProps<{
  values: Contract;
}>();

const item = toRef(props, "values");
</script>
