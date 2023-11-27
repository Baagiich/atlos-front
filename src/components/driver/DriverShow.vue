<template>
  <Toolbar
    :actions="['delete']"
    :breadcrumb="breadcrumb"
    :is-loading="isLoading"
    @delete="deleteItem"
  />

  <v-container fluid>
    <v-alert
      v-if="error || deleteError || driverImagesError"
      type="error"
      class="mb-4"
      closable
    >
      {{ error || deleteError || driverImagesError }}
    </v-alert>

    <ActionCell
      v-if="item"
      :actions="['update']"
      @update="goToUpdatePage(item)"
    />
    <router-link
      v-if="item"
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
            {{ $t("driver.firstName") }}
          </td>

          <td>
            {{ item.firstName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driver.lastName") }}
          </td>

          <td>
            {{ item.lastName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driver.phoneNumber") }}
          </td>

          <td>
            {{ item.phoneNumber }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driver.email") }}
          </td>

          <td>
            {{ item.email }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("driver.registerNumber") }}
          </td>

          <td>
            {{ item.registerNumber }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <SimpleDriverImageList :items="driverImages"></SimpleDriverImageList>

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
import { useDriverDeleteStore } from "@/store/driver/delete";
import { useDriverShowStore } from "@/store/driver/show";
import { useDriverImageListStore } from "@/store/driverimage/list";
import { useBreadcrumb } from "@/composables/breadcrumb";
import ActionCell from "@/components/common/ActionCell.vue";
import { Driver } from "@/types/driver";
import SimpleDriverImageList from "@/components/driverimage/SimpleDriverImageList.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const driverShowStore = useDriverShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(driverShowStore);

const driverDeleteStore = useDriverDeleteStore();
const { deleted, error: deleteError } = storeToRefs(driverDeleteStore);
const driverImageListStore = useDriverImageListStore();
const { items: driverImages, error: driverImagesError } =
  storeToRefs(driverImageListStore);

useMercureItem({
  store: driverShowStore,
  deleteStore: driverDeleteStore,
  redirectRouteName: "DriverList",
});

await driverShowStore.retrieve(decodeURIComponent(route.params.id as string));

await driverImageListStore.getItems({
  page: 1,
  driver: route.params.id as string,
});

async function deleteItem() {
  if (!item?.value) {
    driverDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await driverDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "DriverList" });
}

function goToUpdatePage(item: Driver) {
  router.push({
    name: "DriverUpdate",
    params: { id: item["@id"] },
  });
}

onBeforeUnmount(() => {
  driverShowStore.$reset();
});
</script>
