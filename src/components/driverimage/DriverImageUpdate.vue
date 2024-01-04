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
import Form from "@/components/driverimage/DriverImageForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useDriverImageDeleteStore } from "@/store/driverimage/delete";
import { useDriverImageUpdateStore } from "@/store/driverimage/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useDriverImageCreateStore } from "@/store/driverimage/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { DriverImage } from "@/types/driverimage";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverimageCreateStore = useDriverImageCreateStore();
const { created } = storeToRefs(driverimageCreateStore);

const driverimageDeleteStore = useDriverImageDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  driverimageDeleteStore,
);

const driverimageUpdateStore = useDriverImageUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(driverimageUpdateStore);

useMercureItem({
  store: driverimageUpdateStore,
  deleteStore: driverimageDeleteStore,
  redirectRouteName: "DriverImageList",
});

await driverimageUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: DriverImage) {
  await driverimageUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    driverimageUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await driverimageDeleteStore.deleteItem(item?.value);

  router.push({ name: "DriverImageList" });
}

onBeforeUnmount(() => {
  driverimageUpdateStore.$reset();
  driverimageCreateStore.$reset();
  driverimageDeleteStore.$reset();
});
</script>
