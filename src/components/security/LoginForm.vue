<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-right">
        <v-icon color="red">mdi-web</v-icon>
        <select v-model="locale" style="cursor: pointer">
          <option
            v-for="(availableLocale, index) in $i18n.availableLocales"
            :key="`locale-${availableLocale}`"
            :value="availableLocale"
            :selected="index == 0"
          >
            {{ $t(availableLocale) }}
          </option>
        </select>
      </div>
      <div class="text-subtitle-1 text-medium-emphasis">{{ $t("email") }}</div>
      <v-text-field
        id="email-field"
        v-model="item.email"
        tabindex="1"
        type="email"
        density="compact"
        :placeholder="$t('email')"
        :error="Boolean(violations?.email)"
        :error-messages="violations?.email"
        :rules="[assertRequired(), assertEmail()]"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("password") }}
        <a
          tabindex="3"
          class="text-caption text-decoration-none text-red"
          href="#"
          rel="noopener noreferrer"
          @click="handlePasswordReset"
        >
          {{ $t("forgotPassword") }}
        </a>
      </div>

      <v-text-field
        id="password-field"
        v-model="item.password"
        tabindex="2"
        :error="Boolean(violations?.password)"
        :error-messages="violations?.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        :placeholder="$t('password')"
        :rules="[assertRequired()]"
        density="compact"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
        :disabled="loading"
        :loading="loading"
        tabindex="4"
        block
        class="mb-8"
        color="red"
        size="large"
        type="submit"
      >
        {{ $t("signin") }}
      </v-btn>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, toRef, Ref, onBeforeUnmount } from "vue";
import type { Auth } from "@/types/auth";
import type { SubmissionErrors } from "@/types/error";
import { VForm } from "vuetify/components";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { watch } from "vue";
import { assertRequired, assertEmail } from "@/validations";
const router = useRouter();
const props = defineProps<{
  values?: Auth;
  errors?: SubmissionErrors;
  loading: boolean;
}>();
const violations = toRef(props, "errors");

const item: Ref<Auth> = ref({});
const visible = ref(false);
const form: Ref<VForm | undefined> = ref(undefined);
const { locale } = useI18n();

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const emit = defineEmits<{
  (e: "submit", item: Auth): void;
}>();

function emitSubmit() {
  if (!form.value) return;
  emit("submit", item.value);
}

function handlePasswordReset() {
  router.push({
    name: "AdminUserPasswordReset",
  });
}

watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});

onBeforeUnmount(() => {
  localStorage.setItem("locale", locale.value);
});
</script>
