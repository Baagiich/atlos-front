<template>
  <Suspense>
    <FaqCollapseList />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import FaqCollapseList from "@/components/faq/CollapseList.vue";
import Loading from "@/components/common/Loading.vue";
</script>
