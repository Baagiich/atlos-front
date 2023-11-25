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
            {{ $t("shippercompany.firstname") }}
          </td>

          <td>
            {{ item.firstname }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shippercompany.lastname") }}
          </td>

          <td>
            {{ item.lastname }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shippercompany.name") }}
          </td>

          <td>
            {{ item.name }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shippercompany.email") }}
          </td>

          <td>
            {{ item.email }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shippercompany.register") }}
          </td>

          <td>
            {{ item.register }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shippercompany.phoneNumber") }}
          </td>

          <td>
            {{ item.phoneNumber }}
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
import { useShipperCompanyDeleteStore } from "@/store/shippercompany/delete";
import { useShipperCompanyShowStore } from "@/store/shippercompany/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shippercompanyShowStore = useShipperCompanyShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shippercompanyShowStore);

const shippercompanyDeleteStore = useShipperCompanyDeleteStore();
const { deleted, error: deleteError } = storeToRefs(shippercompanyDeleteStore);

useMercureItem({
  store: shippercompanyShowStore,
  deleteStore: shippercompanyDeleteStore,
  redirectRouteName: "ShipperCompanyList",
});

await shippercompanyShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    shippercompanyDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await shippercompanyDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ShipperCompanyList" });
}

onBeforeUnmount(() => {
  shippercompanyShowStore.$reset();
});
</script>
