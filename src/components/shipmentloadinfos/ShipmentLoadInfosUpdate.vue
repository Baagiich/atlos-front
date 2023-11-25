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

    <v-alert
      v-if="created || updated"
      type="success"
      class="mb-4"
      closable="true"
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
import Form from "@/components/shipmentloadinfos/ShipmentLoadInfosForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useShipmentLoadInfosDeleteStore } from "@/store/shipmentloadinfos/delete";
import { useShipmentLoadInfosUpdateStore } from "@/store/shipmentloadinfos/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useShipmentLoadInfosCreateStore } from "@/store/shipmentloadinfos/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { ShipmentLoadInfos } from "@/types/shipmentloadinfos";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadinfosCreateStore = useShipmentLoadInfosCreateStore();
const { created } = storeToRefs(shipmentloadinfosCreateStore);

const shipmentloadinfosDeleteStore = useShipmentLoadInfosDeleteStore();
const { isLoading: deleteLoading, error: deleteError } = storeToRefs(
  shipmentloadinfosDeleteStore,
);

const shipmentloadinfosUpdateStore = useShipmentLoadInfosUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(shipmentloadinfosUpdateStore);

useMercureItem({
  store: shipmentloadinfosUpdateStore,
  deleteStore: shipmentloadinfosDeleteStore,
  redirectRouteName: "ShipmentLoadInfosList",
});

await shipmentloadinfosUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: ShipmentLoadInfos) {
  await shipmentloadinfosUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    shipmentloadinfosUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentloadinfosDeleteStore.deleteItem(item?.value);

  router.push({ name: "ShipmentLoadInfosList" });
}

onBeforeUnmount(() => {
  shipmentloadinfosUpdateStore.$reset();
  shipmentloadinfosCreateStore.$reset();
  shipmentloadinfosDeleteStore.$reset();
});
</script>
