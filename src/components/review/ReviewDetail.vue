<template>
  <v-row class="mt-3">
    <v-col cols="12" md="6">
      <v-card
        v-if="reviewData"
        class="d-flex flex-column mx-auto py-8"
        elevation="10"
        height="500"
        width="360"
      >
        <div class="d-flex justify-center mt-auto text-h5">
          {{ $t("review.overview") }}
        </div>

        <div class="d-flex align-center flex-column my-auto">
          <div class="text-h2 mt-5">
            {{ reviewData.average }}
            <span class="text-h6 ml-n3">/5</span>
          </div>

          <v-rating
            :model-value="reviewData.average"
            color="yellow-darken-3"
            half-increments
            readonly
          ></v-rating>
          <div class="px-3">
            {{ $t("total") }} {{ reviewData.totalRateCount }}
          </div>
        </div>

        <v-list
          bg-color="transparent"
          class="d-flex flex-column-reverse"
          density="compact"
        >
          <v-list-item>
            <v-progress-linear
              :model-value="calculatePercent(reviewData, reviewData.rate1)"
              color="yellow-darken-3"
              height="20"
            ></v-progress-linear>

            <template #prepend>
              <span>1</span>
              <v-icon icon="mdi-star" class="mx-3"></v-icon>
            </template>

            <template #append>
              <div class="rating-values ml-2">
                <span class="d-flex justify-end">
                  {{ calculatePercent(reviewData, reviewData.rate1) }}%
                </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item>
            <v-progress-linear
              :model-value="calculatePercent(reviewData, reviewData.rate2)"
              color="yellow-darken-3"
              height="20"
            ></v-progress-linear>

            <template #prepend>
              <span>2</span>
              <v-icon icon="mdi-star" class="mx-3"></v-icon>
            </template>

            <template #append>
              <div class="rating-values ml-2">
                <span class="d-flex justify-end">
                  {{ calculatePercent(reviewData, reviewData.rate2) }}%
                </span>
              </div>
            </template>
          </v-list-item>

          <v-list-item>
            <v-progress-linear
              :model-value="calculatePercent(reviewData, reviewData.rate3)"
              color="yellow-darken-3"
              height="20"
            ></v-progress-linear>

            <template #prepend>
              <span>3</span>
              <v-icon icon="mdi-star" class="mx-3"></v-icon>
            </template>

            <template #append>
              <div class="rating-values ml-2">
                <span class="d-flex justify-end">
                  {{ calculatePercent(reviewData, reviewData.rate3) }}%
                </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item>
            <v-progress-linear
              :model-value="calculatePercent(reviewData, reviewData.rate4)"
              color="yellow-darken-3"
              height="20"
            ></v-progress-linear>

            <template #prepend>
              <span>4</span>
              <v-icon icon="mdi-star" class="mx-3"></v-icon>
            </template>

            <template #append>
              <div class="rating-values ml-2">
                <span class="d-flex justify-end">
                  {{ calculatePercent(reviewData, reviewData.rate4) }}%
                </span>
              </div>
            </template>
          </v-list-item>

          <v-list-item>
            <v-progress-linear
              :model-value="calculatePercent(reviewData, reviewData.rate5)"
              color="yellow-darken-3"
              height="20"
            ></v-progress-linear>

            <template #prepend>
              <span>5</span>
              <v-icon icon="mdi-star" class="mx-3"></v-icon>
            </template>

            <template #append>
              <div class="rating-values ml-2">
                <span class="d-flex justify-end">
                  {{ calculatePercent(reviewData, reviewData.rate5) }}%
                </span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <v-list
        v-if="reviewList && reviewList.length > 0"
        lines="two"
        class="review-list"
      >
        <v-list-item v-for="(item, index) in reviewList" :key="index">
          <template #prepend>
            <v-icon
              color="grey-lighten"
              icon="mdi-account-circle-outline"
              size="large"
            ></v-icon>
          </template>
          <v-list-item-title class="d-flex align-center">
            <b class="mr-2">{{ getUserEmail(item) }}</b>
            <v-rating
              :model-value="item.rating"
              :length="5"
              :size="22"
              color="yellow-darken-3"
              half-increments
              readonly
            ></v-rating
          ></v-list-item-title>

          <v-list-item-subtitle class="mt-2">
            {{ item.content }}
            <template v-for="(tag, key) in item.tags" :key="key">
              <v-chip size="small" class="ma-2"> {{ tag }} </v-chip>
            </template>
          </v-list-item-subtitle>
          <span class="text-body-2 text-grey">{{
            item.createdAt ? formatDateTimeFull(item.createdAt) : ""
          }}</span>
          <v-divider></v-divider>
        </v-list-item>
      </v-list>
      <v-container v-else class="text-center">
        <v-icon icon="mdi-package-variant" size="200" color="grey"></v-icon>
        <p class="text-grey">{{ $t("review.empty") }}</p>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { Review } from "@/types/review";
import { ReviewUser } from "@/types/reviewuser";
import { formatDateTimeFull } from "@/utils/date";
import { computed, toRef } from "vue";

const props = defineProps<{
  reviewUserData: ReviewUser;
  reviewList: [Review];
}>();

const reviewUserDataRef = toRef(props, "reviewUserData");
const reviewData = computed(() => {
  if (!reviewUserDataRef.value || Array.isArray(reviewUserDataRef.value)) {
    return new ReviewUser();
  }

  return reviewUserDataRef.value as ReviewUser;
});

function calculatePercent(reviewData: ReviewUser, rate: number) {
  return rate === 0 ? 0 : Math.round((rate * 100) / reviewData.totalRateCount);
}

function getUserEmail(item: Review) {
  return item.sender && typeof item.sender !== "string"
    ? item.sender.email
    : "";
}
</script>

<style lang="scss">
.review-list .v-list-item__prepend {
  align-self: start;
}
</style>
