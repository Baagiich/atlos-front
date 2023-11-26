<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable="true">
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable="true">
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
import Form from "@/components/requests/RequestsForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useRequestsDeleteStore } from "@/store/requests/delete";
import { useRequestsUpdateStore } from "@/store/requests/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useRequestsCreateStore } from "@/store/requests/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Requests } from "@/types/requests";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const requestsCreateStore = useRequestsCreateStore();
const { created } = storeToRefs(requestsCreateStore);

const requestsDeleteStore = useRequestsDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(requestsDeleteStore);

const requestsUpdateStore = useRequestsUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(requestsUpdateStore);

useMercureItem({
  store: requestsUpdateStore,
  deleteStore: requestsDeleteStore,
  redirectRouteName: "RequestsList",
});

await requestsUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: Requests) {
  await requestsUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    requestsUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await requestsDeleteStore.deleteItem(item?.value);

  router.push({ name: "RequestsList" });
}

onBeforeUnmount(() => {
  requestsUpdateStore.$reset();
  requestsCreateStore.$reset();
  requestsDeleteStore.$reset();
});
</script>
