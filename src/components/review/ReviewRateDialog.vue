<template>
  <v-dialog v-model="show" class="text-center" persistent width="400">
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <v-form ref="form" @submit.prevent="emitConfirm">
      <v-card>
        <v-card-text>
          {{ $t("review.confirmTitle") }}
        </v-card-text>
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t("id") }}</td>
              <td>{{ shipment?.shipmentCode }}</td>
            </tr>
            <tr>
              <td>{{ $t("shipment.fromAddress") }}</td>
              <td>{{ shipment?.fromAddress?.city.name }}</td>
            </tr>
            <tr>
              <td>{{ $t("shipment.toAddress") }}</td>
              <td>{{ shipment?.toAddress?.city.name }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-card-text>
          <v-rating
            v-model="item.rating"
            hover
            :length="5"
            :size="48"
            active-color="primary"
          />
          <div class="mt-5">
            <v-select
              v-if="formattedTags"
              v-model="item.tags"
              :items="formattedTags"
              item-title="name"
              item-value="name"
              variant="outlined"
              :label="$t('select')"
              :multiple="true"
              clearable
            >
            </v-select>
            <v-textarea
              v-model="item.content"
              type="text"
              variant="outlined"
              :label="$t('description')"
            >
            </v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error-darken-1" variant="text" @click.stop="emitCancel">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            class="text-none px-6"
            :disabled="isButtonDisable"
            :loading="isLoading"
            variant="flat"
            color="success"
            prepend-icon="mdi-check"
            type="submit"
          >
            {{ $t("review.confirmBtn") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, Ref, ref, toRef } from "vue";
import { useReviewTagList } from "@/store/review/taglist";
import { useReviewCreateStore } from "@/store/review/create";
import { storeToRefs } from "pinia";
import { Review } from "@/types/review";
import { VForm } from "vuetify/components";
import { Shipment } from "@/types/shipment";
import * as enumHelper from "@/utils/enumHelper";
import { ReviewTagType } from "@/types/reviewTagtype";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const reviewTagList = useReviewTagList();
const reviewCreateStore = useReviewCreateStore();

const { items: reviewTags } = storeToRefs(reviewTagList);
const { created, isLoading, error } = storeToRefs(reviewCreateStore);

const props = defineProps<{
  show: boolean;
  shipment: Shipment;
}>();

let show = toRef(props, "show");

const item: Ref<Review> = ref({});
const isButtonDisable = computed(() => {
  return (item.value.rating && item.value.rating > 3) ||
    (item.value.tags && item.value.tags.length > 0) ||
    item.value.content
    ? false
    : true;
});

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();

const form: Ref<VForm | null> = ref(null);

const reviewTagTypes = enumHelper.getMap(ReviewTagType);

const formattedTags = computed(() => {
  if (reviewTags?.value) {
    return reviewTags.value.map((reviewTag) => {
      let newTag = { name: reviewTag.name };
      reviewTagTypes.forEach((tag) => {
        if (tag.value == reviewTag.name) {
          newTag = { name: t("review." + tag.key) };
        }
      });
      return newTag;
    });
  }
  return null;
});

function emitCancel() {
  item.value = {};
  reviewCreateStore.setError(undefined);
  emit("cancel");
}

async function emitConfirm() {
  await createReview();

  if (!created?.value) {
    return;
  }
  item.value = {};
  emit("confirm");
}

async function sendRequest() {
  await reviewTagList.getItems({
    page: 1,
    page_size: 100,
  });
}

sendRequest();

async function createReview() {
  item.value.shipment = props.shipment["@id"];
  await reviewCreateStore.create(item.value);
}
</script>
