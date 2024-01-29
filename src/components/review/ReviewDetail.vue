<template>
  <v-row class="mt-3">
    <v-col cols="12" md="5">
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
    <v-col cols="12" md="7">
      <v-data-table-server
        v-if="reviewList && reviewList.length > 0"
        :headers="headers"
        :items="reviewList"
        :items-length="totalItems"
        :loading="isLoading"
        :items-per-page="itemsPerPage"
        :no-data-text="$t('review.empty')"
        @update:page="updatePage"
        @update:sortBy="updateOrder"
        @update:items-per-page="updatePerPage"
      >
        <template #item.senderEmail="{ item }">
          {{ item.senderEmail }}
        </template>
        <template #item.rating="{ item }">
          <v-rating
            :model-value="item.rating"
            color="orange-darken-2"
            density="compact"
            size="small"
            readonly
          ></v-rating>
        </template>
        <template #item.tags="{ item }">
          <v-chip
            v-for="(tag, key) in item.tags"
            :key="key"
            size="small"
            class="ma-2"
          >
            {{ $t(tag) }}
          </v-chip>
        </template>
        <template #item.createdAt="{ item }">
          {{ item.createdAt ? formatDateTimeFull(item.createdAt) : "" }}
        </template>
      </v-data-table-server>
      <v-container v-else class="text-center">
        <v-icon icon="mdi-package-variant" size="200" color="grey"></v-icon>
        <p class="text-grey">{{ $t("review.empty") }}</p>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ReviewUser } from "@/types/reviewuser";
import { formatDateTimeFull } from "@/utils/date";
import { computed, Ref, ref, toRef } from "vue";
import { useReviewList } from "@/store/review/list";
import { storeToRefs } from "pinia";
import { Filters, VuetifyOrder } from "@/types/list";
import { useI18n } from "vue-i18n";

const reviewListStore = useReviewList();
const { t } = useI18n();

const {
  items: reviewList,
  totalItems,
  isLoading,
} = storeToRefs(reviewListStore);

const props = defineProps<{
  reviewUserData: ReviewUser;
  listFilters: Filters;
}>();

const page = ref(1);
const itemsPerPage = ref(10);
const ordering = ref({});
const filters: Ref<Filters> = ref({});

if (props.listFilters) {
  filters.value = {
    ...props.listFilters,
  };
}

async function sendRequest() {
  await reviewListStore.getItems({
    page: +page.value,
    order: ordering.value,
    page_size: itemsPerPage.value,
    ...filters.value,
  });
}

sendRequest();

const headers = [
  {
    title: t("email"),
    key: "senderEmail",
    sortable: false,
  },
  {
    title: t("review.title"),
    key: "rating",
    sortable: true,
  },
  {
    title: t("review.tag"),
    key: "tags",
    sortable: false,
  },
  {
    title: t("description"),
    key: "content",
    sortable: false,
  },
  {
    title: t("date"),
    key: "createdAt",
    sortable: false,
  },
];

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

function updatePage(newPage: number) {
  page.value = newPage;

  sendRequest();
}

function updatePerPage(size: number) {
  itemsPerPage.value = size;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  if (newOrder) {
    ordering.value = { [newOrder.key]: newOrder.order };
    sendRequest();
  }
}
</script>

<style lang="scss">
.review-list .v-list-item__prepend {
  align-self: start;
}
</style>
