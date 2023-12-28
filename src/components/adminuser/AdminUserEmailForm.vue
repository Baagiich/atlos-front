<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col class="mx-auto" cols="12" sm="6" md="4">
        <v-text-field
          v-model="item.email"
          :label="$t('adminuser.email')"
          :error="Boolean(violations?.email)"
          :error-messages="violations?.email"
          :rules="emailRules"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.email = undefined"
            >
              mdi-email
            </v-icon>
          </template>
        </v-text-field>
        <v-card-item v-if="canResend">
          {{ countdownTimerFormatted }}</v-card-item
        >
        <v-btn :disabled="canResend" color="primary" type="submit">{{
          $t(sendRequest)
        }}</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRef, Ref } from "vue";
import type { SubmissionErrors } from "@/types/error";
import { VForm } from "vuetify/components";
import { PasswordReset } from "@/types/passwordReset";
import { assertEmail, assertRequired } from "@/validations";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const props = defineProps<{
  values?: PasswordReset;
  errors?: SubmissionErrors;
}>();
const violations = toRef(props, "errors");
const { t } = useI18n();
const item: Ref<PasswordReset> = ref({});
const emailRules = [assertRequired(), assertEmail()];
if (props.values) {
  item.value = {
    ...props.values,
  };
}
const sendRequest = ref("submit");
const canResend = ref(false);
const emit = defineEmits<{
  (e: "submit", item: PasswordReset): void;
}>();
const countdownTimer = ref(120);
const countdownTimerFormatted = ref();
async function emitSubmit() {
  const v = await form.value.validate();
  if (v.valid) {
    sendRequest.value = "submitAgain";
    canResend.value = true;
    startTimer();
    emit("submit", item.value);
  }
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
function startTimer() {
  if (countdownTimer.value > 0) {
    countdownTimer.value -= 1;
    countdownTimerFormatted.value = dayjs
      .duration(countdownTimer.value, "seconds")
      .format("mm:ss");
    setTimeout(startTimer, 1000);
  } else {
    canResend.value = false;
  }
}
</script>
