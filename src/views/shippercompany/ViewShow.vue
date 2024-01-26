<template>
  <Suspense>
    <Show />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Show from "@/components/shippercompany/ShipperCompanyShow.vue";
import Loading from "@/components/common/Loading.vue";
</script>
