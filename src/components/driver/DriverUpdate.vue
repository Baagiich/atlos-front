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
import Form from "@/components/driver/DriverForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useDriverDeleteStore } from "@/store/driver/delete";
import { useDriverUpdateStore } from "@/store/driver/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useDriverCreateStore } from "@/store/driver/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Driver } from "@/types/driver";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverCreateStore = useDriverCreateStore();
const { created } = storeToRefs(driverCreateStore);

const driverDeleteStore = useDriverDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(driverDeleteStore);

const driverUpdateStore = useDriverUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(driverUpdateStore);

useMercureItem({
  store: driverUpdateStore,
  deleteStore: driverDeleteStore,
  redirectRouteName: "DriverList",
});

await driverUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: Driver) {
  await driverUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    driverUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await driverDeleteStore.deleteItem(item?.value);

  router.push({ name: "DriverList" });
}

onBeforeUnmount(() => {
  driverUpdateStore.$reset();
  driverCreateStore.$reset();
  driverDeleteStore.$reset();
});
</script>
