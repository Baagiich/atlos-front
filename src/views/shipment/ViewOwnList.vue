<template>
  <Suspense>
    <List :own="true"/>

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/shipment/ShipmentList.vue";
</script>
