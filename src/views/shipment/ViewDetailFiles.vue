<template>
  <Suspense>
    <DetailFiles />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import DetailFiles from "@/components/shipmentdetail/ShipmentImages.vue";
</script>
