<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.driver"
          :label="$t('driverimage.driver')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.tag"
          :label="$t('driverimage.tag')"
          type="string"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { DriverImage } from "@/types/driverimage";

const props = defineProps<{
  values: DriverImage;
}>();

const item = toRef(props, "values");
</script>
