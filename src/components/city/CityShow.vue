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
            {{ $t("city.name") }}
          </td>

          <td>
            {{ item.name }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("city.state") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('StateShow')"
              :to="{ name: 'StateShow', params: { id: item.state } }"
            >
              {{ item.state }}
            </router-link>

            <p v-else>
              {{ item.state }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("city.capital") }}
          </td>

          <td>
            {{ item.capital }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("city.addresses") }}
          </td>

          <td>
            <template v-if="router.hasRoute('AddressShow')">
              <router-link
                v-for="address in item.addresses"
                :key="address"
                :to="{ name: 'AddressShow', params: { id: address } }"
              >
                {{ address }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p v-for="address in item.addresses" :key="address">
                {{ address }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("city.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("city.createdAt") }}
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
import { useCityDeleteStore } from "@/store/city/delete";
import { useCityShowStore } from "@/store/city/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const cityShowStore = useCityShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(cityShowStore);

const cityDeleteStore = useCityDeleteStore();
const { deleted, error: deleteError } = storeToRefs(cityDeleteStore);

useMercureItem({
  store: cityShowStore,
  deleteStore: cityDeleteStore,
  redirectRouteName: "CityList",
});

await cityShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    cityDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await cityDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "CityList" });
}

onBeforeUnmount(() => {
  cityShowStore.$reset();
});
</script>
