<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <div>
      <h2>{{ $t("review.title") }}</h2>
      <div class="mt-15">
        <ReviewDetail
          v-if="item && item.review && item.receivedReviews"
          :review-user-data="item.review"
          :review-list="item.receivedReviews"
        ></ReviewDetail>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import ReviewDetail from "@/components/review/ReviewDetail.vue";
import { useAdminUserShowStore } from "@/store/adminuser/show";
import { useSecurityLoginStore } from "@/store/security/login";
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";

const userShowStore = useAdminUserShowStore();
const securityLoginStore = useSecurityLoginStore();

const { retrieved: item } = storeToRefs(userShowStore);
const { userTokenData, error } = storeToRefs(securityLoginStore);

if (userTokenData?.value?.iri) {
  await userShowStore.retrieve(userTokenData?.value?.iri);
}

onBeforeUnmount(() => {
  userShowStore.$reset();
});
</script>
