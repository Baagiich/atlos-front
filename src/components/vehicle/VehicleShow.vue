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
            {{ $t("vehicle.plateNumber") }}
          </td>

          <td>
            {{ item.plateNumber }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.shipper") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('AdminUserShow')"
              :to="{ name: 'AdminUserShow', params: { id: item.adminuser } }"
            >
              {{ item.adminuser }}
            </router-link>

            <p v-else>
              {{ item.adminuser }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.vehicleType") }}
          </td>

          <td>
            {{ item.vehicleType }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.vehicleCapacity") }}
          </td>

          <td>
            {{ item.vehicleCapacity }}
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
import { useVehicleDeleteStore } from "@/store/vehicle/delete";
import { useVehicleShowStore } from "@/store/vehicle/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleShowStore = useVehicleShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(vehicleShowStore);

const vehicleDeleteStore = useVehicleDeleteStore();
const { deleted, error: deleteError } = storeToRefs(vehicleDeleteStore);

useMercureItem({
  store: vehicleShowStore,
  deleteStore: vehicleDeleteStore,
  redirectRouteName: "VehicleList",
});

await vehicleShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    vehicleDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await vehicleDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "VehicleList" });
}

onBeforeUnmount(() => {
  vehicleShowStore.$reset();
});
</script>
