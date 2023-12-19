<template>
  <Toolbar :breadcrumb="breadcrumb" :is-loading="isLoading" />
  <v-container fluid>
    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      closable="true"
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
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/currency/CurrencyForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useCurrencyUpdateStore } from "@/store/currency/update";
import { useCurrencyCreateStore } from "@/store/currency/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Currency } from "@/types/currency";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const currencyCreateStore = useCurrencyCreateStore();
const { created } = storeToRefs(currencyCreateStore);

const currencyUpdateStore = useCurrencyUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(currencyUpdateStore);

await currencyUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Currency) {
  await currencyUpdateStore.update(item);
}

onBeforeUnmount(() => {
  currencyCreateStore.$reset();
  currencyUpdateStore.$reset();
});
</script>
