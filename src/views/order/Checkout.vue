<template>
  <Suspense>
    <Checkout />
    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import Checkout from "@/components/order/OrderCheckout.vue";
</script>
