<template>
  <Suspense>
    <ProfileReview />
    <template #fallback><Loading :visible="true" /></template>
  </Suspense>
</template>

<script setup lang="ts">
import ProfileReview from "@/components/profile/ProfileReview.vue";
import Loading from "@/components/common/Loading.vue";
</script>
