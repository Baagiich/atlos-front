<template>
  <Suspense>
    <Detail />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Detail from "@/components/shipmentdetail/ShipmentDetail.vue";
import Loading from "@/components/common/Loading.vue";
</script>
