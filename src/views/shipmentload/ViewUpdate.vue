<template>
  <Suspense>
    <Update />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Update from "@/components/shipmentload/ShipmentLoadUpdate.vue";
import Loading from "@/components/common/Loading.vue";
</script>
