<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" ms="6" md="4">
        <v-alert v-if="error" type="error" class="mb-4" :closable="true">
          {{ error }}
        </v-alert>
        <v-img class="mt-15" height="50" :src="logoAtlos"></v-img>
        <LoginForm
          class="mt-10"
          :errors="violations"
          :loading="isLoading"
          @submit="login"
        />
      </v-col>
    </v-row>
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import LoginForm from "@/components/security/LoginForm.vue";
import { useSecurityLoginStore } from "@/store/security/login";
import Loading from "@/components/common/Loading.vue";
import { Auth } from "@/types/auth";
import { storeToRefs } from "pinia";
import logoAtlos from "@/assets/logo-atlos.png";
import isUndefined from "lodash/isUndefined";

const router = useRouter();

const securityLoginStore = useSecurityLoginStore();

const { isLoading, violations, error } = storeToRefs(securityLoginStore);

async function login(item: Auth) {
  await securityLoginStore.login(item);

  if (isUndefined(error?.value)) {
    router.push({
      name: "ShipmentList",
    });
  }
}

onBeforeUnmount(() => {
  securityLoginStore.$reset();
});
</script>
