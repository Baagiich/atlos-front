<template>
  <Suspense>
    <PasswordReset />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import PasswordReset from "@/components/adminuser/AdminUserPasswordReset.vue";
</script>
