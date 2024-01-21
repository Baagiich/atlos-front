<template>
  <Suspense>
    <FaqCollapseList />

    <template #fallback>{{ $t("loading") }}</template>
  </Suspense>
</template>

<script setup lang="ts">
import FaqCollapseList from "@/components/faq/CollapseList.vue";
</script>
