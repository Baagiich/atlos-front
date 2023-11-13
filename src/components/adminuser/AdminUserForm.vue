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
        <v-text-field
          v-model="item.userType"
          :error="Boolean(violations?.userType)"
          :error-messages="violations?.userType"
          :label="$t('adminuser.userType')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.userType = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.roles"
          :error="Boolean(violations?.roles)"
          :error-messages="violations?.roles"
          :label="$t('adminuser.roles')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.roles = undefined"
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
        <v-text-field
          v-model="item.status"
          :error="Boolean(violations?.status)"
          :error-messages="violations?.status"
          :label="$t('adminuser.status')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.status = undefined"
            >
              mdi-close
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.verified"
          :error="Boolean(violations?.verified)"
          :error-messages="violations?.verified"
          :label="$t('adminuser.verified')"
        >
          <template #append-inner>
            <v-icon
              style="cursor: pointer"
              @click.prevent.stop="item.verified = undefined"
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
          :label="$t('adminuser.driver')"
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
