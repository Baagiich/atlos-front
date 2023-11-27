<template>

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{ error }}</v-alert>

    <Form :errors="violations" @submit="verify" />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/shippercompany/ShipperCompanyVerifyForm.vue";
import { useShipperCompanyRegisterStore } from "@/store/shippercompany/register";
import type { AdminUserVerify } from "@/types/adminuserverify";

const router = useRouter();

const shippercompanyRegisterStore = useShipperCompanyRegisterStore();
const { created, isLoading, violations, error , verified} = storeToRefs(shippercompanyRegisterStore);
async function verify(item: AdminUserVerify) {

  await shippercompanyRegisterStore.verify(item);

  if (!verified?.value) {
    return;
  }

  router.push({ name: "Home"});
  
}

onBeforeUnmount(() => {
  shippercompanyRegisterStore.$reset();
});
</script>
