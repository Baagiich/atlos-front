<template>
  <Suspense>
    <WalletList />
    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import WalletList from "@/components/wallet/WalletList.vue";
import Loading from "@/components/common/Loading.vue";
</script>
