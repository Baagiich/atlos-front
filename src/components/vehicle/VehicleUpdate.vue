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
import Form from "@/components/vehicle/VehicleForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useVehicleDeleteStore } from "@/store/vehicle/delete";
import { useVehicleUpdateStore } from "@/store/vehicle/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useVehicleCreateStore } from "@/store/vehicle/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Vehicle } from "@/types/vehicle";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const vehicleCreateStore = useVehicleCreateStore();
const { created } = storeToRefs(vehicleCreateStore);

const vehicleDeleteStore = useVehicleDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(vehicleDeleteStore);

const vehicleUpdateStore = useVehicleUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(vehicleUpdateStore);

useMercureItem({
  store: vehicleUpdateStore,
  deleteStore: vehicleDeleteStore,
  redirectRouteName: "VehicleList",
});

await vehicleUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Vehicle) {
  await vehicleUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    vehicleUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await vehicleDeleteStore.deleteItem(item?.value);

  router.push({ name: "VehicleList" });
}

onBeforeUnmount(() => {
  vehicleUpdateStore.$reset();
  vehicleCreateStore.$reset();
  vehicleDeleteStore.$reset();
});
</script>
