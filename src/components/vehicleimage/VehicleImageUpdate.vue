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
import Form from "@/components/vehicleimage/VehicleImageForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useVehicleImageDeleteStore } from "@/store/vehicleimage/delete";
import { useVehicleImageUpdateStore } from "@/store/vehicleimage/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useVehicleImageCreateStore } from "@/store/vehicleimage/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { VehicleImage } from "@/types/vehicleimage";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleimageCreateStore = useVehicleImageCreateStore();
const { created } = storeToRefs(vehicleimageCreateStore);

const vehicleimageDeleteStore = useVehicleImageDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  vehicleimageDeleteStore,
);

const vehicleimageUpdateStore = useVehicleImageUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(vehicleimageUpdateStore);

useMercureItem({
  store: vehicleimageUpdateStore,
  deleteStore: vehicleimageDeleteStore,
  redirectRouteName: "VehicleImageList",
});

await vehicleimageUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: VehicleImage) {
  await vehicleimageUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    vehicleimageUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await vehicleimageDeleteStore.deleteItem(item?.value);

  router.push({ name: "VehicleImageList" });
}

onBeforeUnmount(() => {
  vehicleimageUpdateStore.$reset();
  vehicleimageCreateStore.$reset();
  vehicleimageDeleteStore.$reset();
});
</script>
