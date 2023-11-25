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
            {{ $t("adminuser.firstName") }}
          </td>

          <td>
            {{ item.firstName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.lastName") }}
          </td>

          <td>
            {{ item.lastName }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.userType") }}
          </td>

          <td>
            {{ item.userType }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.roles") }}
          </td>

          <td>
            {{ item.roles }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.email") }}
          </td>

          <td>
            {{ item.email }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.phoneNumber") }}
          </td>

          <td>
            {{ item.phoneNumber }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.plainPassword") }}
          </td>

          <td>
            {{ item.plainPassword }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.status") }}
          </td>

          <td>
            {{ item.status }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.verified") }}
          </td>

          <td>
            {{ item.verified }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("adminuser.driver") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('DriverShow')"
              :to="{ name: 'DriverShow', params: { id: item.driver } }"
            >
              {{ item.driver }}
            </router-link>

            <p v-else>
              {{ item.driver }}
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
import { useAdminUserDeleteStore } from "@/store/adminuser/delete";
import { useAdminUserShowStore } from "@/store/adminuser/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const adminuserShowStore = useAdminUserShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(adminuserShowStore);

const adminuserDeleteStore = useAdminUserDeleteStore();
const { deleted, error: deleteError } = storeToRefs(adminuserDeleteStore);

useMercureItem({
  store: adminuserShowStore,
  deleteStore: adminuserDeleteStore,
  redirectRouteName: "AdminUserList",
});

await adminuserShowStore.retrieve(
  decodeURIComponent(route.params.id as string),
);

async function deleteItem() {
  if (!item?.value) {
    adminuserDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await adminuserDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "AdminUserList" });
}

onBeforeUnmount(() => {
  adminuserShowStore.$reset();
});
</script>
