<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable="true">
      {{ error || deleteError }}
    </v-alert>

    <v-alert v-if="created || updated" type="success" class="mb-4" closable="true">
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
import Form from "@/components/shipmentload/ShipmentLoadForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import { useShipmentLoadUpdateStore } from "@/store/shipmentload/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipmentLoadCreateStore } from "@/store/shipmentload/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipmentLoad } from "@/types/shipmentload";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadCreateStore = useShipmentLoadCreateStore();
const { created } = storeToRefs(shipmentloadCreateStore);

const shipmentloadDeleteStore = useShipmentLoadDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(shipmentloadDeleteStore);

const shipmentloadUpdateStore = useShipmentLoadUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(shipmentloadUpdateStore);

useMercureItem({
  store: shipmentloadUpdateStore,
  deleteStore: shipmentloadDeleteStore,
  redirectRouteName: "ShipmentLoadList",
});

await shipmentloadUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

async function update(item: ShipmentLoad) {
  await shipmentloadUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    shipmentloadUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentloadDeleteStore.deleteItem(item?.value);

  router.push({ name: "ShipmentLoadList" });
}

onBeforeUnmount(() => {
  shipmentloadUpdateStore.$reset();
  shipmentloadCreateStore.$reset();
  shipmentloadDeleteStore.$reset();
});
</script>
