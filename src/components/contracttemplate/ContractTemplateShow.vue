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
            {{ $t("contracttemplate.name") }}
          </td>

          <td>
            {{ item.name }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.template") }}
          </td>

          <td>
            {{ item.template }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.userType") }}
          </td>

          <td>
            {{ item.userType }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.contracts") }}
          </td>

          <td>
            <template v-if="router.hasRoute('ContractShow')">
              <router-link
                v-for="contract in item.contracts"
                :key="contract"
                :to="{ name: 'ContractShow', params: { id: contract } }"
              >
                {{ contract }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p v-for="contract in item.contracts" :key="contract">
                {{ contract }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.activeFrom") }}
          </td>

          <td>
            {{ formatDateTime(item.activeFrom) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.activeTo") }}
          </td>

          <td>
            {{ formatDateTime(item.activeTo) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.createdAt") }}
          </td>

          <td>
            {{ formatDateTime(item.createdAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("contracttemplate.active") }}
          </td>

          <td>
            {{ item.active }}
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
import { useContractTemplateDeleteStore } from "@/store/contracttemplate/delete";
import { useContractTemplateShowStore } from "@/store/contracttemplate/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const contracttemplateShowStore = useContractTemplateShowStore();
const {
  retrieved: item,
  isLoading,
  error,
} = storeToRefs(contracttemplateShowStore);

const contracttemplateDeleteStore = useContractTemplateDeleteStore();
const { deleted, error: deleteError } = storeToRefs(
  contracttemplateDeleteStore,
);

useMercureItem({
  store: contracttemplateShowStore,
  deleteStore: contracttemplateDeleteStore,
  redirectRouteName: "ContractTemplateList",
});

await contracttemplateShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    contracttemplateDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await contracttemplateDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ContractTemplateList" });
}

onBeforeUnmount(() => {
  contracttemplateShowStore.$reset();
});
</script>
