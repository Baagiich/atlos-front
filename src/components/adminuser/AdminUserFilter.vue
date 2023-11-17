<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-select
          v-model="item.userType"
          :label="$t('adminuser.userType')"
          :items="userTypes"
          item-title="key"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-select
          v-model="item.status"
          :label="$t('adminuser.status')"
          :items="userStatusTypes"
          item-title="key"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field
          v-model="item.firstName"
          :label="$t('adminuser.firstName')"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field
          v-model="item.lastName"
          :label="$t('adminuser.lastName')"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import type { AdminUser } from "@/types/adminuser";
import { UserType } from "@/types/usertype";
import * as enumHelper from "@/utils/enumHelper";
import { UserStatusType } from "@/types/user_status_type";

const props = defineProps<{
  values: AdminUser;
}>();

const item = toRef(props, "values");

const userTypes = enumHelper.getMap(UserType);
userTypes.unshift({ key: "", value: "" });

const userStatusTypes = enumHelper.getMap(UserStatusType);
userStatusTypes.unshift({ key: "", value: "" });
</script>
