<template>
  <Suspense>
    <LoginShow />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import LoginShow from "@/components/security/ShipperLoginShow.vue";
import Loading from "@/components/common/Loading.vue";
</script>
