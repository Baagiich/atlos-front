<template>
  <Suspense>
    <Create />

    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import Create from "@/components/consignor/ConsignorCreate.vue";
import Loading from "@/components/common/Loading.vue";
</script>
