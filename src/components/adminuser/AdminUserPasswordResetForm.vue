<template>
  <v-sheet min-height="450">
    <v-form ref="form" @submit.prevent="emitSubmit">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.plainPassword"
            :error="Boolean(violations?.plainPassword)"
            :error-messages="violations?.plainPassword"
            :label="$t('shippercompany.plainPassword')"
            :rules="plainPasswordRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.plainPassword = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="item.plainPasswordConfirm"
            :error="Boolean(violations?.plainPasswordConfirm)"
            :error-messages="violations?.plainPasswordConfirm"
            :label="$t('shippercompany.plainPasswordConfirm')"
            :rules="plainPasswordConfirmRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.plainPasswordConfirm = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>

          <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
            {{ $t("reset") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { SubmissionErrors } from "@/types/error";
import { assertRequired, assertPasswordConfirm } from "@/validations";
import { PasswordResetVerify } from "@/types/passwordReset";
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps<{
  values?: PasswordResetVerify;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");
const item: Ref<PasswordResetVerify> = ref({});
if (props.values) {
  item.value = {
    ...props.values,
  };
}
const plainPasswordRules = [assertRequired()];
const plainPasswordConfirmRules = [
  assertRequired(),
  assertPasswordConfirm("validation.plainPasswordNotMatch", function () {
    return item.value.plainPassword;
  }),
];
const emit = defineEmits<{
  (e: "submit", item: PasswordResetVerify): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  if (!form.value) {
    return;
  }
  const v = await form.value.validate();
  if (v.valid) {
    item.value.passwordChangeToken = route.params.token as string;
    emit("submit", item.value);
    resetForm();
  }
}

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
