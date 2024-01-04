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
            {{ $t("country.isoCode3") }}
          </td>

          <td>
            {{ item.isoCode3 }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("country.name") }}
          </td>

          <td>
            {{ item.name }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("country.states") }}
          </td>

          <td>
            <template v-if="router.hasRoute('StateShow')">
              <router-link
                v-for="state in item.states"
                :key="state"
                :to="{ name: 'StateShow', params: { id: state } }"
              >
                {{ state }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p v-for="state in item.states" :key="state">
                {{ state }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("country.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("country.createdAt") }}
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
import { useCountryDeleteStore } from "@/store/country/delete";
import { useCountryShowStore } from "@/store/country/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const countryShowStore = useCountryShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(countryShowStore);

const countryDeleteStore = useCountryDeleteStore();
const { deleted, error: deleteError } = storeToRefs(countryDeleteStore);

useMercureItem({
  store: countryShowStore,
  deleteStore: countryDeleteStore,
  redirectRouteName: "CountryList",
});

await countryShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    countryDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await countryDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "CountryList" });
}

onBeforeUnmount(() => {
  countryShowStore.$reset();
});
</script>
