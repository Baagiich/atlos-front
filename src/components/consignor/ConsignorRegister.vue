<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable="true">{{
      error
    }}</v-alert>

    <Form
      :errors="violations"
      :contract-template="registrationTemplate"
      @submit="create"
    />
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/consignor/ConsignorForm.vue";
import { useConsignorRegisterStore } from "@/store/consignor/register";
import { useBreadcrumb } from "@/composables/breadcrumb";
import { useContractTemplateListStore } from "@/store/contracttemplate/list";
import { Consignor } from "@/types/consignor";
import { UserType } from "@/types/usertype";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const consignorRegisterStore = useConsignorRegisterStore();
const { created, isLoading, violations, error } = storeToRefs(
  consignorRegisterStore,
);
const contracttemplateListStore = useContractTemplateListStore();
const {
  isLoading: contractTemplateIsLoading,
  registrationTemplate,
  hubUrl,
  error: contractTemplateError,
} = storeToRefs(contracttemplateListStore);
async function create(item: Consignor) {
  await consignorRegisterStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "AdminUserVerify" });
}

async function sendRequest() {
  await contracttemplateListStore.getRegistrationTemplate(
    UserType.CONSIGNOR,
    "consignor_registration_term",
  );
}
await sendRequest();

onBeforeUnmount(() => {
  consignorRegisterStore.$reset();
});
</script>
