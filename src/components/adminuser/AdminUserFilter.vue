<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.userType"
          :label="$t('adminUser.userType')"
          :items="userTypes"
          item-title="value"
          item-value="key"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.status"
          :label="$t('adminUser.status')"
          :items="userStatusTypes"
          item-title="value"
          item-value="key"
        />
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
