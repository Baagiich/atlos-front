<template>
  <v-sheet min-height="450">
    <v-form ref="form" @submit.prevent="emitSubmit">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.recievedCode"
            :error="Boolean(violations?.recievedCode)"
            :error-messages="violations?.recievedCode"
            :label="$t('shippercompany.recievedCode')"
            :rules="recievedCodeRules"
            type="number"
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
        </v-col>
      </v-row>
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
        </v-col>
        <v-col cols="12" sm="6" md="6">
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
import { onBeforeUnmount, ref, Ref, toRaw, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { SubmissionErrors } from "@/types/error";
import { useI18n } from "vue-i18n";
import { AdminUserVerify } from "@/types/adminuserverify";
import { assertRequired } from "@/validations/assertRequired";
import {assertPasswordConfirm} from "@/validations/assertPasswordConfirm";
import {assertNumber} from "@/validations/assertNumber";
const { t } = useI18n();
const props = defineProps<{
  values?: AdminUserVerify;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");
const showPlainPassword = ref(false);
const item: Ref<AdminUserVerify> = ref({});
if (props.values) {
  item.value = {
    ...props.values,
  };
}
const plainPasswordRules = [assertRequired(t("validation.plainPasswordRequired"))];
const plainPasswordConfirmRules = [
assertRequired(t("validation.plainPasswordConfirmRequired")),
assertPasswordConfirm(t("validation.plainPasswordNotMatch"), item.value.plainPassword)
];
const recievedCodeRules = [assertNumber(t("validation.recievedCodeRequired"))];
const emit = defineEmits<{
  (e: "submit", item: AdminUserVerify): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
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
