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
            {{ $t("contract.adminUser") }}
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
            {{ $t("contract.contractTemplate") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('ContractTemplateShow')"
              :to="{ name: 'ContractTemplateShow', params: { id: item.contracttemplate } }"
            >
              {{ item.contracttemplate }}
            </router-link>

            <p v-else>
              {{ item.contracttemplate }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contract.signed") }}
          </td>

          <td>
            {{ item.signed }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("contract.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contract.createdAt") }}
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
import { useContractDeleteStore } from "@/store/contract/delete";
import { useContractShowStore } from "@/store/contract/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contractShowStore = useContractShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(contractShowStore);

const contractDeleteStore = useContractDeleteStore();
const { deleted, error: deleteError } = storeToRefs(contractDeleteStore);

useMercureItem({
  store: contractShowStore,
  deleteStore: contractDeleteStore,
  redirectRouteName: "ContractList",
});

await contractShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    contractDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await contractDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ContractList" });
}

onBeforeUnmount(() => {
  contractShowStore.$reset();
});
</script>
