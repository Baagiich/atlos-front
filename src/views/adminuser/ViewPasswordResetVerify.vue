<template>
    <Suspense>
      <PasswordResetVerify />
  
      <template #fallback>{{ $t("loading") }}</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import PasswordResetVerify from "@/components/adminuser/AdminUserPasswordResetVerify.vue";
  </script>
  