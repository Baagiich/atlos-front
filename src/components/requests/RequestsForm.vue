<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.fromUser"
          :error="Boolean(violations?.fromUser)"
          :error-messages="violations?.fromUser"
          :label="$t('requests.fromUser')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.fromUser = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.toUser"
          :error="Boolean(violations?.toUser)"
          :error-messages="violations?.toUser"
          :label="$t('requests.toUser')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.toUser = undefined"
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
          :label="$t('requests.code')"
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
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.type"
          :error="Boolean(violations?.type)"
          :error-messages="violations?.type"
          :label="$t('requests.type')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.type = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model.number="item.targetEntityId"
          :error="Boolean(violations?.targetEntityId)"
          :error-messages="violations?.targetEntityId"
          :label="$t('requests.targetEntityId')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.targetEntityId = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.params"
          :error="Boolean(violations?.params)"
          :error-messages="violations?.params"
          :label="$t('requests.params')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.params = undefined"
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
          :label="$t('requests.updatedAt')"
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
          :label="$t('requests.createdAt')"
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
import type { Requests } from "@/types/requests";
import type { SubmissionErrors } from "@/types/error";
const props = defineProps<{
  values?: Requests;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<Requests> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

const emit = defineEmits<{
  (e: "submit", item: Requests): void;
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
