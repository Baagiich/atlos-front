<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.email"
          :label="$t('consignor.email')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.name"
          :label="$t('consignor.name')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          v-model="item.phoneNumber"
          :label="$t('consignor.phoneNumber')"
          type="string"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="item.status"
          :label="$t('consignor.status')"
          :items="userStatus"
          item-title="key"
          item-value="value"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import * as enumHelper from "@/utils/enumHelper";
import { Consignor } from "@/types/consignor";
import { UserStatusType } from "@/types/user_status_type";

const props = defineProps<{
  values: Consignor;
}>();

const item = toRef(props, "values");

const userStatus = enumHelper.getMap(UserStatusType);
userStatus.unshift({ key: "", value: "" });
</script>
