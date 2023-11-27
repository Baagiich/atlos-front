<template>
  <Suspense>
    <Verify />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import Verify from "@/components/shippercompany/ShipperCompanyRegisterVerify.vue";
</script>
