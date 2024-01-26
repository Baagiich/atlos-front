<template>
  <Suspense>
    <PasswordReset />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import PasswordReset from "@/components/adminuser/AdminUserPasswordReset.vue";
import Loading from "@/components/common/Loading.vue";
</script>
