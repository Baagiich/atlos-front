<template>
    <Suspense>
      <Detail />
  
      <template #fallback>{{ $t("loading") }}</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import Detail from "@/components/shipmentdetail/ShipmentDetail.vue";
  </script>
  