<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.email"
          :label="$t('email')"
          :error="Boolean(violations?.email)"
          :error-messages="violations?.email"
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
        <v-text-field
          v-model="item.password"
          :label="$t('password')"
          :error="Boolean(violations?.password)"
          :error-messages="violations?.password"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.password = undefined"
            >
              mdi-lock
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
</template>

<script setup lang="ts">
import { ref, toRef, Ref } from "vue";
import type { Auth } from "@/types/auth";
import type { SubmissionErrors } from "@/types/error";
import { VForm } from "vuetify/components";

const props = defineProps<{
  values?: Auth;
  errors?: SubmissionErrors;
}>();
const violations = toRef(props, "errors");

const item: Ref<Auth> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const emit = defineEmits<{
  (e: "submit", item: Auth): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}

const form: Ref<VForm | null> = ref(null);

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}
</script>
