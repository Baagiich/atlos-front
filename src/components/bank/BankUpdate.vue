<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />
  <v-container fluid>
    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      :closable="true"
    >
      <template v-if="updated">
        {{ $t("itemUpdated", [updated["@id"]]) }}
      </template>
      <template v-else-if="created">
        {{ $t("itemCreated", [created["@id"]]) }}
      </template>
    </v-alert>
    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </v-container>
  <Loading :visible="isLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/bank/BankForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useBankUpdateStore } from "@/store/bank/update";
import { useBankCreateStore } from "@/store/bank/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Bank } from "@/types/bank";

const route = useRoute();
const breadcrumb = useBreadcrumb();

const bankCreateStore = useBankCreateStore();
const { created } = storeToRefs(bankCreateStore);

const bankUpdateStore = useBankUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  violations,
} = storeToRefs(bankUpdateStore);

await bankUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: Bank) {
  await bankUpdateStore.update(item);
}

onBeforeUnmount(() => {
  bankCreateStore.$reset();
  bankUpdateStore.$reset();
});
</script>
