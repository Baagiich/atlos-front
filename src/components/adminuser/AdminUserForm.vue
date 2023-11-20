<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.firstName"
          :error="Boolean(violations?.firstName)"
          :error-messages="violations?.firstName"
          :label="$t('adminuser.firstName')"
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
          :label="$t('adminuser.lastName')"
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
        <v-select
          v-model="item.userType"
          :label="$t('adminuser.userType')"
          :items="userTypes"
          item-title="key"
          item-value="value"
          :error="Boolean(violations?.userType)"
          :error-messages="violations?.userType"
        >
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.email"
          :error="Boolean(violations?.email)"
          :error-messages="violations?.email"
          :label="$t('adminuser.email')"
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
          :label="$t('adminuser.phoneNumber')"
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
          v-model="item.plainPassword"
          :error="Boolean(violations?.plainPassword)"
          :error-messages="violations?.plainPassword"
          :label="$t('adminuser.plainPassword')"
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
        <v-select
          v-model="item.status"
          :error="Boolean(violations?.status)"
          :error-messages="violations?.status"
          :items="userStatusTypes"
          item-title="key"
          item-value="value"
          :label="$t('adminuser.status')"
        >
        </v-select>
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
import type { AdminUser } from "@/types/adminuser";
import type { SubmissionErrors } from "@/types/error";
import { UserStatusType } from "@/types/user_status_type";
import * as enumHelper from "@/utils/enumHelper";
import { UserType } from "@/types/usertype";

const props = defineProps<{
  values?: AdminUser;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

const item: Ref<AdminUser> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const userTypes = enumHelper.getMap(UserType);
userTypes.unshift({ key: "", value: "" });

const userStatusTypes = enumHelper.getMap(UserStatusType);
userStatusTypes.unshift({ key: "", value: "" });

const emit = defineEmits<{
  (e: "submit", item: AdminUser): void;
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
