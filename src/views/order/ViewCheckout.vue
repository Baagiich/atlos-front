<template>
  <Suspense>
    <Checkout />
    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Checkout from "@/components/order/OrderCheckout.vue";
import Loading from "@/components/common/Loading.vue";
</script>
