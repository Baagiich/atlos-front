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
            {{ $t("driverimage.image") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('MediaObjectShow')"
              :to="{
                name: 'MediaObjectShow',
                params: { id: item.image },
              }"
            >
              {{ item.image }}
            </router-link>

            <p v-else>
              {{ item.image }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driverimage.driver") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('DriverShow')"
              :to="{ name: 'DriverShow', params: { id: item.driver } }"
            >
              {{ item.driver }}
            </router-link>

            <p v-else>
              {{ item.driver }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driverimage.tag") }}
          </td>

          <td>
            {{ item.tag }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driverimage.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driverimage.createdAt") }}
          </td>

          <td>
            {{ formatDateTime(item.createdAt) }}
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
import { useDriverImageDeleteStore } from "@/store/driverimage/delete";
import { useDriverImageShowStore } from "@/store/driverimage/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverimageShowStore = useDriverImageShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(driverimageShowStore);

const driverimageDeleteStore = useDriverImageDeleteStore();
const { deleted, error: deleteError } = storeToRefs(driverimageDeleteStore);

useMercureItem({
  store: driverimageShowStore,
  deleteStore: driverimageDeleteStore,
  redirectRouteName: "DriverImageList",
});

await driverimageShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    driverimageDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await driverimageDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "DriverImageList" });
}

onBeforeUnmount(() => {
  driverimageShowStore.$reset();
});
</script>
