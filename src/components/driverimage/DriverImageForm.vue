<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.image"
          :error="Boolean(violations?.image)"
          :error-messages="violations?.image"
          :label="$t('driverimage.image')"
          required
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.image = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.driver"
          :error="Boolean(violations?.driver)"
          :error-messages="violations?.driver"
          :label="$t('driverimage.driver')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.driver = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.tag"
          :error="Boolean(violations?.tag)"
          :error-messages="violations?.tag"
          :label="$t('driverimage.tag')"
          required
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.tag = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.updatedAt"
          :error="Boolean(violations?.updatedAt)"
          :error-messages="violations?.updatedAt"
          :label="$t('driverimage.updatedAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.updatedAt = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.createdAt"
          :error="Boolean(violations?.createdAt)"
          :error-messages="violations?.createdAt"
          :label="$t('driverimage.createdAt')"
          type="date"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.createdAt = undefined"
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
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import { formatDateInput } from "@/utils/date";
import type { DriverImage } from "@/types/driverimage";
import type { SubmissionErrors } from "@/types/error";
const props = defineProps<{
  values?: DriverImage;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<DriverImage> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

const emit = defineEmits<{
  (e: "submit", item: DriverImage): void;
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
