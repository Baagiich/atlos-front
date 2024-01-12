<template>
  <Suspense>
    <LoginShow />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import LoginShow from "@/components/security/ConsignorLoginShow.vue";
</script>
