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
            {{ $t("vehicleimage.image") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('MediaObjectShow')"
              :to="{
                name: 'MediaObjectShow',
                params: { id: item.mediaobject },
              }"
            >
              {{ item.mediaobject }}
            </router-link>

            <p v-else>
              {{ item.mediaobject }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicleimage.vehicle") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('VehicleShow')"
              :to="{ name: 'VehicleShow', params: { id: item.vehicle } }"
            >
              {{ item.vehicle }}
            </router-link>

            <p v-else>
              {{ item.vehicle }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicleimage.tag") }}
          </td>

          <td>
            {{ item.tag }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicleimage.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicleimage.createdAt") }}
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
import { useVehicleImageDeleteStore } from "@/store/vehicleimage/delete";
import { useVehicleImageShowStore } from "@/store/vehicleimage/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleimageShowStore = useVehicleImageShowStore();
const {
  retrieved: item,
  isLoading,
  error,
} = storeToRefs(vehicleimageShowStore);

const vehicleimageDeleteStore = useVehicleImageDeleteStore();
const { deleted, error: deleteError } = storeToRefs(vehicleimageDeleteStore);

useMercureItem({
  store: vehicleimageShowStore,
  deleteStore: vehicleimageDeleteStore,
  redirectRouteName: "VehicleImageList",
});

await vehicleimageShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    vehicleimageDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await vehicleimageDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "VehicleImageList" });
}

onBeforeUnmount(() => {
  vehicleimageShowStore.$reset();
});
</script>
