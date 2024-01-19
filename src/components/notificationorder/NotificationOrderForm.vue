<template>
  <v-form ref="form" fast-fail @submit.prevent="emitSubmit">
    <v-row v-if="item">
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.title"
          :error="Boolean(violations?.title)"
          :error-messages="violations?.title"
          :label="$t('notification.title')"
          :rules="titleRules"
          required
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.title = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
        <v-select
          v-model="item.segment"
          :error="Boolean(violations?.segment)"
          :error-messages="violations?.segment"
          :items="segments"
          item-title="key"
          item-value="value"
          :label="$t('notification.segment')"
          :rules="segmentRules"
          required
          clearable
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.segment = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-textarea
          v-model="item.description"
          :error="Boolean(violations?.description)"
          :error-messages="violations?.description"
          :label="$t('description')"
          :rules="descriptionRules"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.description = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-btn
          color="primary"
          variant="text"
          class="ml-2"
          @click="goToBackPage"
        >
          {{ $t("back") }}
        </v-btn>
        <v-btn color="primary" type="submit">{{ $t("save") }}</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { NotificationOrder } from "@/types/notificationorder";
import type { SubmissionErrors } from "@/types/error";
import { useRouter } from "vue-router";
import * as enumHelper from "@/utils/enumHelper";
import { NotificationSegment } from "@/types/notification_segment";
import { assertRequired, assertMaxLength } from "@/validations";

const props = defineProps<{
  values?: NotificationOrder;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");
const router = useRouter();

const item: Ref<NotificationOrder> = ref({});
const segments = enumHelper.getMap(NotificationSegment);
const titleRules = [assertRequired(), assertMaxLength(200)];
const descriptionRules = [assertRequired(), assertMaxLength(250)];
const segmentRules = [assertRequired()];

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const form: Ref<VForm | null> = ref(null);

const emit = defineEmits<{
  (e: "submit", item: NotificationOrder): void;
}>();

async function emitSubmit() {
  if (!form.value) {
    return;
  }
  const { valid } = await form.value.validate();
  if (valid) {
    emit("submit", item.value);
  }
}

function goToBackPage() {
  router.back();
}
</script>
