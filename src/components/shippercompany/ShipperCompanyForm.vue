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
            :rules="nameRules"
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
            :rules="nameRules"
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
      <v-row justify="center">
        <v-dialog v-model="dialog" width="800">
          <v-card class="overflow-y-auto pt-6">
            <v-card-title>
              <span class="py-6 px-6 text-h5"> {{ $t("terms") }}</span>
            </v-card-title>
            <v-card-text>
              <div
                class="text-center"
                v-html="contractTemplate?.template"
              ></div>
            </v-card-text>
            <v-card-actions class="py-6 px-6">
              <v-spacer></v-spacer>
              <v-btn
                color="medium-emphasis"
                variant="text"
                @click="dialog = false"
              >
                {{ $t("close") }}
              </v-btn>
              <v-btn
                color="green-darken-1"
                variant="text"
                @click="handleAcceptContract"
              >
                {{ $t("accept") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-fade-transition>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { ShipperCompany } from "@/types/shippercompany";
import type { SubmissionErrors } from "@/types/error";
import { ContractTemplate } from "@/types/contracttemplate";
import {
  assertRequired,
  assertMaxLength,
  assertEmail,
  assertChecked,
  assertPhoneNumber,
} from "@/validations";
const props = defineProps<{
  values?: ShipperCompany;
  errors?: SubmissionErrors;
  contractTemplate?: ContractTemplate;
}>();

const violations = toRef(props, "errors");
const contractSigned = ref(false);
const item: Ref<ShipperCompany> = ref({});
const dialog = ref(false);
if (props.values) {
  item.value = {
    ...props.values,
    ...props.contractTemplate,
  };
}

const nameRules = [assertRequired(), assertMaxLength(50)];

const emailRules = [assertRequired(), assertEmail()];

const phoneNumberRules = [
  assertRequired(),
  assertMaxLength(20),
  assertPhoneNumber(),
];
const registerNumberRules = [assertRequired(), assertMaxLength(12)];
const contractSignedRules = [assertChecked()];
const emit = defineEmits<{
  (e: "submit", item: ShipperCompany): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  if (!form.value) {
    return;
  }
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
