<template>
  <Suspense>
    <List />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/driverimage/DriverImageList.vue";
</script>
