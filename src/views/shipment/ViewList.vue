<template>
  <Suspense>
    <List />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/shipment/ShipmentList.vue";
import Loading from "@/components/common/Loading.vue";
</script>
