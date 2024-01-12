<template>
  <v-sheet class="position-relative" min-height="450">
    <v-form ref="form" class="position-absolute" @submit.prevent="emitSubmit">
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.firstName"
            :error="Boolean(violations?.firstName)"
            :error-messages="violations?.firstName"
            :label="$t('consignor.firstName')"
            :rules="nameRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.firstName = undefined"
              >
                mdi-close
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.lastName"
            :error="Boolean(violations?.lastName)"
            :error-messages="violations?.lastName"
            :label="$t('consignor.lastName')"
            :rules="nameRules"
          >
            <template #append-inner>
              <v-icon
                style="cursor: pointer"
                @click.prevent.stop="item.lastName = undefined"
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
            :label="$t('consignor.name')"
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
            :label="$t('consignor.email')"
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
            v-model="item.phoneNumber"
            :error="Boolean(violations?.phoneNumber)"
            :error-messages="violations?.phoneNumber"
            :label="$t('consignor.phoneNumber')"
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
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            v-model="item.register"
            :error="Boolean(violations?.register)"
            :error-messages="violations?.register"
            :label="$t('consignor.register')"
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
        <v-col v-if="updateForm" cols="12">
          <v-text-field
            v-model="item.certificate"
            :error="Boolean(violations?.certificate)"
            :error-messages="violations?.certificate"
            :label="$t('consignor.certificate')"
            variant="plain"
            disabled
          >
          </v-text-field>
          <FileUploader></FileUploader>
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
        max-height="400"
        append-icon="$close"
        class="mx-auto overflow-y-auto"
        elevation="16"
        :title="$t('terms')"
        
      >
        <template #append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>

        <v-divider></v-divider>
          <div class="mb-4 py-12 text-center">
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
import { ref, Ref, toRef } from "vue";
import { VForm } from "vuetify/components";
import type { Consignor } from "@/types/consignor";
import type { SubmissionErrors } from "@/types/error";
import { ContractTemplate } from "@/types/contracttemplate";
import {
  assertRequired,
  assertMaxLength,
  assertEmail,
  assertChecked,
  assertPhoneNumber,
} from "@/validations";
import FileUploader from "../common/FileUploader.vue";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { storeToRefs } from "pinia";
const props = defineProps<{
  values?: Consignor;
  errors?: SubmissionErrors;
  contractTemplate?: ContractTemplate;
  updateForm?: boolean;
}>();

const violations = toRef(props, "errors");
const contractSigned = ref(false);
const item: Ref<Consignor> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    ...props.contractTemplate,
  };
}
const nameRules = [assertRequired(), assertMaxLength(50)];
const emailRules = [assertRequired(), assertEmail()];

const phoneNumberRules = [assertRequired(), assertMaxLength(20), assertPhoneNumber()];
const registerNumberRules = [assertRequired(), assertMaxLength(12)];
const contractSignedRules = [assertChecked()];
const dialog = ref(false);

const mediaObjectCreateStore = useMediaObjectCreateStore();
const { created } = storeToRefs(mediaObjectCreateStore);
const emit = defineEmits<{
  (e: "submit", item: Consignor): void;
}>();
const form: Ref<VForm | null> = ref(null);
async function emitSubmit() {
  if (!form.value) {
    return;
  }
  const v = await form.value.validate();
  if (v.valid) {
    item.value.certificate = created?.value?.["@id"];
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
