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
import Form from "@/components/address/AddressForm.vue";
import Loading from "@/components/common/Loading.vue";
import { useAddressDeleteStore } from "@/store/address/delete";
import { useAddressUpdateStore } from "@/store/address/update";
import { useMercureItem } from "@/composables/mercureItem";
import { useAddressCreateStore } from "@/store/address/create";
import { useBreadcrumb } from "@/composables/breadcrumb";
import type { Address } from "@/types/address";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const addressCreateStore = useAddressCreateStore();
const { created } = storeToRefs(addressCreateStore);

const addressDeleteStore = useAddressDeleteStore();
const { isLoading: deleteLoading, error: deleteError } =
  storeToRefs(addressDeleteStore);

const addressUpdateStore = useAddressUpdateStore();
const {
  retrieved: item,
  updated,
  isLoading,
  error,
  violations,
} = storeToRefs(addressUpdateStore);

useMercureItem({
  store: addressUpdateStore,
  deleteStore: addressDeleteStore,
  redirectRouteName: "AddressList",
});

await addressUpdateStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function update(item: Address) {
  await addressUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    addressUpdateStore.setError(t("itemNotFound"));
    return;
  }

  await addressDeleteStore.deleteItem(item?.value);

  router.push({ name: "AddressList" });
}

onBeforeUnmount(() => {
  addressUpdateStore.$reset();
  addressCreateStore.$reset();
  addressDeleteStore.$reset();
});
</script>
