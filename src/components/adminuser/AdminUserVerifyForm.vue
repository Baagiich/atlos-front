<template>
  <v-sheet min-height="450">
    <v-form ref="form" @submit.prevent="emitSubmit">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        
        <v-text-field
          v-model="item.recievedCode"
          :error="Boolean(violations?.recievedCode)"
          :error-messages="violations?.recievedCode"
          :label="$t('adminuser.recievedCode')"
          :rules="recievedCodeRules"
          autocomplete="off"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.recievedCode = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
       

        <v-text-field
          v-model="item.plainPassword"
          :error="Boolean(violations?.plainPassword)"
          :error-messages="violations?.plainPassword"
          :label="$t('adminuser.plainPassword')"
          :rules="plainPasswordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="off"
          @click:append="showPassword = !showPassword"
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
          :label="$t('adminuser.plainPasswordConfirm')"
          :rules="plainPasswordConfirmRules"
          :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordConfirm ? 'text' : 'password'"
          autocomplete="off"
          @click:append="showPasswordConfirm = !showPasswordConfirm"
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

        <v-btn color="primary" type="submit">{{ $t("submit") }}</v-btn>

        <v-btn color="primary" variant="text" class="ml-2" @click="resetForm">
          {{ $t("reset") }}
        </v-btn>
      </v-card>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { SubmissionErrors } from "@/types/error";
import { AdminUserVerify } from "@/types/adminuserverify";
import {
  assertRequired,
  assertNumber,
  assertPasswordConfirm,
} from "@/validations";
const props = defineProps<{
  values?: AdminUserVerify;
  errors?: SubmissionErrors;
}>();
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const violations = toRef(props, "errors");
const item: Ref<AdminUserVerify> = ref({});
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
const recievedCodeRules = [assertNumber("validation.recievedCodeRequired")];
const emit = defineEmits<{
  (e: "submit", item: AdminUserVerify): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  if (!form.value) {
    return;
  }
  const v = await form.value.validate();
  if (v.valid) {
    item.value.recievedCode = Number(item.value.recievedCode);
    emit("submit", item.value);
  }
}

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
