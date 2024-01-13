<template>
  <Toolbar
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    :title="$t('shippercompany\.title')"
  />

  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">{{
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
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import Form from "@/components/shippercompany/ShipperCompanyForm.vue";
import { useShipperCompanyRegisterStore } from "@/store/shippercompany/register";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipperCompany } from "@/types/shippercompany";
import { useContractTemplateListStore } from "@/store/contracttemplate/list";
import { UserType } from "@/types/usertype";

const router = useRouter();
const breadcrumb = useBreadcrumb();

const shippercompanyRegisterStore = useShipperCompanyRegisterStore();
const { created, isLoading, violations, error } = storeToRefs(
  shippercompanyRegisterStore,
);
const contracttemplateListStore = useContractTemplateListStore();
const { registrationTemplate } = storeToRefs(contracttemplateListStore);
async function create(item: ShipperCompany) {
  await shippercompanyRegisterStore.create(item);

  if (!created?.value) {
    return;
  }

  router.push({ name: "ShipperCompanyVerify" });
}

async function sendRequest() {
  await contracttemplateListStore.getRegistrationTemplate(
    UserType.SHIPPER,
    "shipper_company_registration_term",
  );
}
await sendRequest();

onBeforeUnmount(() => {
  shippercompanyRegisterStore.$reset();
});
</script>
