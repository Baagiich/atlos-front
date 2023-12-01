<template>
  <v-sheet class="position-relative" min-height="450">
    <v-form ref="form" class="position-absolute" @submit.prevent="emitSubmit">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.firstname"
            :error="Boolean(violations?.firstname)"
            :error-messages="violations?.firstname"
            :label="$t('shippercompany.firstname')"
            :rules="firstnameRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.firstname = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.lastname"
            :error="Boolean(violations?.lastname)"
            :error-messages="violations?.lastname"
            :label="$t('shippercompany.lastname')"
            :rules="lastnameRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.lastname = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.name"
            :error="Boolean(violations?.name)"
            :error-messages="violations?.name"
            :label="$t('shippercompany.name')"
            :rules="nameRules"
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
            v-model="item.email"
            :error="Boolean(violations?.email)"
            :error-messages="violations?.email"
            :label="$t('shippercompany.email')"
            :rules="emailRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.email = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.register"
            :error="Boolean(violations?.register)"
            :error-messages="violations?.register"
            :label="$t('shippercompany.register')"
            :rules="registerNumberRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.register = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.phoneNumber"
            :error="Boolean(violations?.phoneNumber)"
            :error-messages="violations?.phoneNumber"
            :label="$t('shippercompany.phoneNumber')"
            :rules="phoneNumberRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.phoneNumber = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="props.contractTemplate">
        <v-checkbox
          :model-value="contractSigned"
          :rules="contractSignedRules"
          required
          @click="contractSigned = !contractSigned"
        >
          <template #label>
            <div>
              <v-btn variant="plain" @click="dialog = !dialog">
                {{ $t("terms") }}
              </v-btn>
              {{ $t("accepted") }}
            </div>
          </template>
        </v-checkbox>
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

    <v-fade-transition hide-on-leave>
      <v-card
        v-if="dialog"
        append-icon="$close"
        class="mx-auto"
        elevation="16"
        :title="$t('terms')"
      >
        <template #append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>

        <v-divider></v-divider>

        <div class="py-12 text-center">
          {{ contractTemplate?.template }}
        </div>

        <v-divider></v-divider>
        <div class="pa-4 text-end">
          <v-btn
            class="text-none mr-2"
            color="success"
            min-width="92"
            rounded
            variant="outlined"
            @click="handleAcceptContract"
          >
            {{ $t("accept") }}
          </v-btn>
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            rounded
            variant="outlined"
            @click="dialog = false"
          >
            {{ $t("close") }}
          </v-btn>
        </div>
      </v-card>
    </v-fade-transition>
  </v-sheet>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, Ref, toRaw, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { ShipperCompany } from "@/types/shippercompany";
import type { SubmissionErrors } from "@/types/error";
import { ContractTemplate } from "@/types/contracttemplate";
import { useI18n } from "vue-i18n";
import {
  assertRequired,
  assertMaxLength,
  assertEmail,
  assertChecked,
} from "@/validations";
const { t } = useI18n();
const props = defineProps<{
  values?: ShipperCompany;
  errors?: SubmissionErrors;
  contractTemplate?: ContractTemplate;
}>();

const violations = toRef(props, "errors");
const contractSigned = ref(false);
const item: Ref<ShipperCompany> = ref({});
const dialog = ref(false);
const alert = ref(false);
if (props.values) {
  item.value = {
    ...props.values,
    ...props.contractTemplate,
  };
}

const firstnameRules = [assertRequired(), assertMaxLength(50)];
const nameRules = [assertRequired(), assertMaxLength(50)];
const lastnameRules = [assertRequired(), assertMaxLength(50)];

const emailRules = [
  assertRequired(),
  assertEmail(),
];

const phoneNumberRules = [assertRequired(), assertMaxLength(20)];
const registerNumberRules = [assertRequired(), assertMaxLength(12)];
const contractSignedRules = [
  assertChecked(t("validation.contractTemplateError")),
];
const emit = defineEmits<{
  (e: "submit", item: ShipperCompany): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  const v = await form.value.validate();
  if (v.valid) {
    emit("submit", item.value);
  }
}

function resetForm() {
  if (!form.value) return;

  form.value.reset();
}

function handleAcceptContract() {
  dialog.value = false;
  contractSigned.value = true;
}
</script>
