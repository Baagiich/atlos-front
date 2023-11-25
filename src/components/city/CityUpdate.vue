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
      closable="true"
    >
      {{ error || deleteError }}
    </v-alert>

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

  <Loading :visible="isLoading || deleteLoading" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Form from "@/components/city/CityForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useCityDeleteStore } from "@/store/city/delete";
import { useCityUpdateStore } from "@/store/city/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useCityCreateStore } from "@/store/city/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { City } from "@/types/city";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const cityCreateStore = useCityCreateStore();
const { created } = storeToRefs(cityCreateStore);

const cityDeleteStore = useCityDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(cityDeleteStore);

const cityUpdateStore = useCityUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(cityUpdateStore);

useMercureItem({
  store: cityUpdateStore,
  deleteStore: cityDeleteStore,
  redirectRouteName: "CityList",
});

await cityUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: City) {
  await cityUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    cityUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await cityDeleteStore.deleteItem(item?.value);

  router.push({ name: "CityList" });
}

onBeforeUnmount(() => {
  cityUpdateStore.$reset();
  cityCreateStore.$reset();
  cityDeleteStore.$reset();
});
</script>
