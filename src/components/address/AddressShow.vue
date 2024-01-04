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
            {{ $t("address.street") }}
          </td>

          <td>
            {{ item.street }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("address.city") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('CityShow')"
              :to="{ name: 'CityShow', params: { id: item.city } }"
            >
              {{ item.city }}
            </router-link>

            <p v-else>
              {{ item.city }}
            </p>
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
import { useAddressDeleteStore } from "@/store/address/delete";
import { useAddressShowStore } from "@/store/address/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const addressShowStore = useAddressShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(addressShowStore);

const addressDeleteStore = useAddressDeleteStore();
const { deleted, error: deleteError } = storeToRefs(addressDeleteStore);

useMercureItem({
  store: addressShowStore,
  deleteStore: addressDeleteStore,
  redirectRouteName: "AddressList",
});

await addressShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    addressDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await addressDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "AddressList" });
}

onBeforeUnmount(() => {
  addressShowStore.$reset();
});
</script>
