<template>
  <Suspense>
    <DriverRequestShow />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import DriverRequestShow from "@/components/driverrequest/DriverRequestShow.vue";
</script>
