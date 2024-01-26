<template>
  <Suspense>
    <Show />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Show from "@/components/driverimage/DriverImageShow.vue";
import Loading from "@/components/common/Loading.vue";
</script>
