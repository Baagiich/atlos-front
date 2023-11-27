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

    <v-table v-if="item">
      <thead>
        <tr>
          <th>{{ $t("field") }}</th>
          <th>{{ $t("value") }}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {{ $t("mediaobject.contentUrl") }}
          </td>

          <td>
            {{ item.contentUrl }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <Loading :visible="isLoading" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Toolbar from "@/components/common/Toolbar.vue";
import Loading from "@/components/common/Loading.vue";
import { useMercureItem } from "@/composables/mercureItem";
import { useMediaObjectDeleteStore } from "@/store/mediaobject/delete";
import { useMediaObjectShowStore } from "@/store/mediaobject/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const mediaobjectShowStore = useMediaObjectShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(mediaobjectShowStore);

const mediaobjectDeleteStore = useMediaObjectDeleteStore();
const { deleted, error: deleteError } = storeToRefs(mediaobjectDeleteStore);

useMercureItem({
  store: mediaobjectShowStore,
  deleteStore: mediaobjectDeleteStore,
  redirectRouteName: "MediaObjectList",
});

await mediaobjectShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    mediaobjectDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await mediaobjectDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "MediaObjectList" });
}

onBeforeUnmount(() => {
  mediaobjectShowStore.$reset();
});
</script>
