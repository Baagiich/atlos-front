<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable>
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable>
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
import Form from "@/components/mediaobject/MediaObjectForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useMediaObjectDeleteStore } from "@/store/mediaobject/delete";
import { useMediaObjectUpdateStore } from "@/store/mediaobject/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useMediaObjectCreateStore } from "@/store/mediaobject/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { MediaObject } from "@/types/mediaobject";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const mediaobjectCreateStore = useMediaObjectCreateStore();
const { created } = storeToRefs(mediaobjectCreateStore);

const mediaobjectDeleteStore = useMediaObjectDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  mediaobjectDeleteStore,
);

const mediaobjectUpdateStore = useMediaObjectUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(mediaobjectUpdateStore);

useMercureItem({
  store: mediaobjectUpdateStore,
  deleteStore: mediaobjectDeleteStore,
  redirectRouteName: "MediaObjectList",
});

await mediaobjectUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: MediaObject) {
  await mediaobjectUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    mediaobjectUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await mediaobjectDeleteStore.deleteItem(item?.value);

  router.push({ name: "MediaObjectList" });
}

onBeforeUnmount(() => {
  mediaobjectUpdateStore.$reset();
  mediaobjectCreateStore.$reset();
  mediaobjectDeleteStore.$reset();
});
</script>
