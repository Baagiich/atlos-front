<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert v-if="error || deleteError" type="error" class="mb-4" closable>
      {{ error || deleteError }}
    </v-alert>
    <v-alert
    v-if="item && !item.certificate"
      density="compact"
      type="warning"
      :text="$t('informationNotCompleted')"
    ></v-alert>
    <ActionCell
      v-if="item"
      :actions="['update']"
      @update="goToUpdatePage(item)"
    />
    <router-link
      v-if="item.adminEditable"
      id="adminuser-edit-link"
      :to="{ name: 'AdminUserUpdate', params: { id: item.adminUser } }"
      ><v-btn>{{ $t("adminuser.edit") }}</v-btn></router-link
    >
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
            {{ $t("consignor.firstName") }}
          </td>

          <td>
            {{ item.firstName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.lastName") }}
          </td>

          <td>
            {{ item.lastName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.name") }}
          </td>

          <td>
            {{ item.name }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.email") }}
          </td>

          <td>
            {{ item.email }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.phoneNumber") }}
          </td>

          <td>
            {{ item.phoneNumber }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.register") }}
          </td>

          <td>
            {{ item.register }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("consignor.certificate") }}
          </td>

          <td v-if="item.certificate"><MediaObjectThumb :id="item.certificate"></MediaObjectThumb></td>
          <td v-else class="text-orange-lighten-2">{{ $t("notAvailable") }}</td>
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
import { useConsignorDeleteStore } from "@/store/consignor/delete";
import { useConsignorShowStore } from "@/store/consignor/show";
import { useBreadcrumb } from "@/composables/breadcrumb";
import MediaObjectThumb from "@/components/mediaobject/MediaObjectThumb.vue";
import ActionCell from "../common/ActionCell.vue";
import { Consignor } from "@/types/consignor";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const consignorShowStore = useConsignorShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(consignorShowStore);

const consignorDeleteStore = useConsignorDeleteStore();
const { deleted, error: deleteError } = storeToRefs(consignorDeleteStore);

useMercureItem({
  store: consignorShowStore,
  deleteStore: consignorDeleteStore,
  redirectRouteName: "ConsignorList",
});

await consignorShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    consignorDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await consignorDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ConsignorList" });
}
function goToUpdatePage(item: Consignor) {
  router.push({
    name: "ConsignorUpdate",
    params: { id: item["@id"] },
  });
}
onBeforeUnmount(() => {
  consignorShowStore.$reset();
});
</script>
