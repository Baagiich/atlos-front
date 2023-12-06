<template>
    <v-container fluid>
      <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{error}}</v-alert>
      <v-card-subtitle>
            {{ $t("enterNewPassword") }}
      </v-card-subtitle>
      <Form :errors="violations" @submit="handleResetVerify" />
    </v-container>
  
    <Loading :visible="isLoading" />
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card>
        <v-card-title>
            {{ $t("successfull") }}
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">{{ $t("close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { onBeforeUnmount, ref } from "vue";
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import Loading from "@/components/common/Loading.vue";
  import Form from "@/components/adminuser/AdminUserPasswordResetForm.vue";
  import { useSecurityPasswordResetStore } from "@/store/security/passwordReset";
  import { PasswordReset, PasswordResetVerify } from "@/types/passwordReset";
  
  const router = useRouter();
  const securityPasswordResetStore = useSecurityPasswordResetStore();
  const { isLoading, violations, error, data } = storeToRefs(securityPasswordResetStore);
  const dialog = ref(false);
  async function handleResetVerify(item: PasswordResetVerify) {
    await securityPasswordResetStore.passwordResetVerify(item);

    if (!data.value) {
      return;
    }
    if(data.value?.message === 'Successful'){
        dialog.value = true
    }
  }
  
  onBeforeUnmount(() => {
    securityPasswordResetStore.$reset();
  });
  </script>
  