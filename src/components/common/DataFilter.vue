<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t("filters") }}

        <template #actions>
          <v-icon size="large">mdi-filter-variant</v-icon>
        </template>
      </v-expansion-panel-title>

      <v-expansion-panel-text style="padding: 20px 0">
        <slot name="filter" />

        <v-btn color="primary" size="small" @click="emitFilter">{{
          $t("filter")
        }}</v-btn>

        <v-btn
          color="primary"
          size="small"
          class="ml-2"
          variant="text"
          @click="emitReset"
        >
          {{ $t("reset") }}
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "filter"): void;
  (e: "reset"): void;
}>();

function emitFilter() {
  emit("filter");
}

function emitReset() {
  emit("reset");
}
</script>
