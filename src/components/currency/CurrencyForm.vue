<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row v-if="item">
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.name"
          :error="Boolean(violations?.name)"
          :error-messages="violations?.name"
          :label="$t('currency.name')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.name = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.code"
          :error="Boolean(violations?.code)"
          :error-messages="violations?.code"
          :label="$t('currency.code')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.code = undefined"
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
        <v-btn
          color="primary"
          variant="text"
          class="ml-2"
          @click="goToBackPage"
        >
          {{ $t("back") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { Currency } from "@/types/currency";
import type { SubmissionErrors } from "@/types/error";
import { useRouter } from "vue-router";
const props = defineProps<{
  values?: Currency;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");
const router = useRouter();

const item: Ref<Currency> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const emit = defineEmits<{
  (e: "submit", item: Currency): void;
}>();

function emitSubmit() {
  if (!item.value) {
    return;
  }
  emit("submit", item.value);
}

const form: Ref<VForm | null> = ref(null);

function goToBackPage() {
  router.back();
}
</script>
