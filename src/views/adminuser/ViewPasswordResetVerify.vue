<template>
  <Suspense>
    <PasswordResetVerify />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import PasswordResetVerify from "@/components/adminuser/AdminUserPasswordResetVerify.vue";
import Loading from "@/components/common/Loading.vue";
</script>
