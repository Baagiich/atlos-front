<template>
  <Suspense>
    <List />
    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/notificationorder/NotificationOrderList.vue";
import Loading from "@/components/common/Loading.vue";
</script>
