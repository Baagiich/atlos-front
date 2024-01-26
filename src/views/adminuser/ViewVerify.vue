<template>
  <Suspense>
    <Verify />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Verify from "@/components/adminuser/AdminUserVerify.vue";
import Loading from "@/components/common/Loading.vue";
</script>
