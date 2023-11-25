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
            {{ $t("requests.fromUser") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('AdminUserShow')"
              :to="{ name: 'AdminUserShow', params: { id: item.adminuser } }"
            >
              {{ item.adminuser }}
            </router-link>

            <p v-else>
              {{ item.adminuser }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.toUser") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('AdminUserShow')"
              :to="{ name: 'AdminUserShow', params: { id: item.adminuser } }"
            >
              {{ item.adminuser }}
            </router-link>

            <p v-else>
              {{ item.adminuser }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.code") }}
          </td>

          <td>
            {{ item.code }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.type") }}
          </td>

          <td>
            {{ item.type }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.targetEntityId") }}
          </td>

          <td>
            {{ item.targetEntityId }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.params") }}
          </td>

          <td>
            {{ item.params }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("requests.createdAt") }}
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
import { useRequestsDeleteStore } from "@/store/requests/delete";
import { useRequestsShowStore } from "@/store/requests/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const requestsShowStore = useRequestsShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(requestsShowStore);

const requestsDeleteStore = useRequestsDeleteStore();
const { deleted, error: deleteError } = storeToRefs(requestsDeleteStore);

useMercureItem({
  store: requestsShowStore,
  deleteStore: requestsDeleteStore,
  redirectRouteName: "RequestsList",
});

await requestsShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    requestsDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await requestsDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "RequestsList" });
}

onBeforeUnmount(() => {
  requestsShowStore.$reset();
});
</script>
