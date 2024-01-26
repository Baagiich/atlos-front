<template>
  <Suspense>
    <List />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/city/CityList.vue";
import Loading from "@/components/common/Loading.vue";
</script>
