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
import Form from "@/components/shipment/ShipmentForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentUpdateStore } from "@/store/shipment/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipmentCreateStore } from "@/store/shipment/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Shipment } from "@/types/shipment";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentCreateStore = useShipmentCreateStore();
const { created } = storeToRefs(shipmentCreateStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(shipmentDeleteStore);

const shipmentUpdateStore = useShipmentUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(shipmentUpdateStore);

useMercureItem({
  store: shipmentUpdateStore,
  deleteStore: shipmentDeleteStore,
  redirectRouteName: "ShipmentList",
});

await shipmentUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item?: Shipment) {
  if (!item) {
    return;
  }
  await shipmentUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    shipmentUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentDeleteStore.deleteItem(item?.value);

  router.push({ name: "ShipmentList" });
}

onBeforeUnmount(() => {
  shipmentUpdateStore.$reset();
  shipmentCreateStore.$reset();
  shipmentDeleteStore.$reset();
});
</script>
