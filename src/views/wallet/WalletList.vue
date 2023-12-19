<template>
    <Suspense>
      <WalletList />
      <template #fallback>{{ $t("loading") }}</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import WalletList from "@/components/wallet/WalletList.vue";
  </script>
  