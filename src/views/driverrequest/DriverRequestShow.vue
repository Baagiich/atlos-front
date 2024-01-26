<template>
  <Suspense>
    <DriverRequestShow />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import DriverRequestShow from "@/components/driverrequest/DriverRequestShow.vue";
import Loading from "@/components/common/Loading.vue";
</script>
