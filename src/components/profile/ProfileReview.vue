<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <div>
      <h2>{{ $t("review.title") }}</h2>
      <div v-if="item && item.review && decodedToken" class="mt-15">
        <ReviewDetail
          :review-user-data="item.review"
          :list-filters="{ recipient: decodedToken.iri }"
        ></ReviewDetail>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import ReviewDetail from "@/components/review/ReviewDetail.vue";
import { useAdminUserShowStore } from "@/store/adminuser/show";
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";
import * as apiToken from "@/utils/apiToken";

const userShowStore = useAdminUserShowStore();

const { retrieved: item, error } = storeToRefs(userShowStore);
const decodedToken = apiToken.getDecodedToken();
if (decodedToken) {
  await userShowStore.retrieve(decodedToken.iri);
}

onBeforeUnmount(() => {
  userShowStore.$reset();
});
</script>
