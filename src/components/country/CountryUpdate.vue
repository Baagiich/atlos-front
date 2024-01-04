<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError"
      type="error"
      class="mb-4"
      :closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

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

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/country/CountryForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useCountryDeleteStore } from "@/store/country/delete";
import { useCountryUpdateStore } from "@/store/country/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useCountryCreateStore } from "@/store/country/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Country } from "@/types/country";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const countryCreateStore = useCountryCreateStore();
const { created } = storeToRefs(countryCreateStore);

const countryDeleteStore = useCountryDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(countryDeleteStore);

const countryUpdateStore = useCountryUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(countryUpdateStore);

useMercureItem({
  store: countryUpdateStore,
  deleteStore: countryDeleteStore,
  redirectRouteName: "CountryList",
});

await countryUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Country) {
  await countryUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    countryUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await countryDeleteStore.deleteItem(item?.value);

  router.push({ name: "CountryList" });
}

onBeforeUnmount(() => {
  countryUpdateStore.$reset();
  countryCreateStore.$reset();
  countryDeleteStore.$reset();
});
</script>
