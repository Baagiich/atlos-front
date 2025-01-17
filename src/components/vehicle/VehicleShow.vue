<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError || vehicleImagesError"
      type="error"
      class="mb-4"
      closable
    >
      {{ error || deleteError || vehicleImagesError }}
    </v-alert>
    <ActionCell
      v-if="item"
      :actions="['update']"
      @update="goToUpdatePage(item)"
    />
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
            {{ item.shipper }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.vehicleType") }}
          </td>

          <td>
            {{ vehicletype }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.vehicleCapacity") }}
          </td>

          <td>
            {{ capacity }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.status") }}
          </td>

          <td>
            {{ status }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.fTypeVerified") }}
          </td>

          <td>
            {{ $t("vehicle." + item.fTypeVerified + "") }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("vehicle.fTypeExpireAt") }}
          </td>

          <td>
            {{ formatDateTime(item.fTypeExpireAt) }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
  <SimpleVehicleImageList :items="vehicleImages"></SimpleVehicleImageList>
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
import SimpleVehicleImageList from "@/components/vehicleimage/SimpleVehicleImageList.vue";
import { useVehicleImageListStore } from "@/store/vehicleimage/list";
import { Vehicle } from "@/types/vehicle";
import ActionCell from "../common/ActionCell.vue";
import * as enumHelper from "@/utils/enumHelper";
import { VehicleType } from "@/types/vehicletype";
import { VehicleCapacityType } from "@/types/vehiclecapacitytype";
import { VehicleStatus } from "@/types/vehiclestatus";
import { formatDateTime } from "@/utils/date";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleShowStore = useVehicleShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(vehicleShowStore);

const vehicleDeleteStore = useVehicleDeleteStore();
const { deleted, error: deleteError } = storeToRefs(vehicleDeleteStore);

const vehicleImagesStore = useVehicleImageListStore();
const { items: vehicleImages, error: vehicleImagesError } =
  storeToRefs(vehicleImagesStore);
useMercureItem({
  store: vehicleShowStore,
  deleteStore: vehicleDeleteStore,
  redirectRouteName: "VehicleList",
});

await vehicleShowStore.retrieve(decodeURIComponent(route.params.id as string));

const vehicleTypes = enumHelper.getMap(VehicleType);
vehicleTypes.unshift({ key: "", value: "" });
const vehicletype = vehicleTypes.find(
  (type) => type.value === item?.value?.vehicleType,
)?.key;
const vehicleCapacityTypes = enumHelper.getMap(VehicleCapacityType);
vehicleCapacityTypes.unshift({ key: "", value: "" });
const capacity = vehicleCapacityTypes.find(
  (type) => type.value === item?.value?.vehicleCapacity,
)?.key;

const vehicleStatusTypes = enumHelper.getMap(VehicleStatus);
vehicleStatusTypes.unshift({ key: "", value: "" });
const status = vehicleStatusTypes.find(
  (type) => type.value === item?.value?.status,
)?.key;

await vehicleImagesStore.getItems({
  page: 1,
  vehicle: route.params.id as string,
});
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
function goToUpdatePage(item: Vehicle) {
  router.push({
    name: "VehicleUpdate",
    params: { id: item["@id"] },
  });
}
onBeforeUnmount(() => {
  vehicleShowStore.$reset();
});
</script>
