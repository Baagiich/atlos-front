<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">
      {{ error }}
    </v-alert>

    <LoginForm :errors="violations" @submit="login" />
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LoginForm from './LoginForm.vue'
import { useSecurityLoginStore } from "@/store/security/login";
import { Auth } from "@/types/auth";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const router = useRouter();

const securityLoginStore = useSecurityLoginStore();

const { isLoading, violations, error } = storeToRefs(securityLoginStore);

async function login(item: Auth) {
  await securityLoginStore.login(item);
}

onBeforeUnmount(() => {
  securityLoginStore.$reset();
});
</script>
