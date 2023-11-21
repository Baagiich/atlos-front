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
            {{ $t("shipmentloadinfos.name") }}
          </td>

          <td>
            {{ item.name }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.count") }}
          </td>

          <td>
            {{ item.count }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.length") }}
          </td>

          <td>
            {{ item.length }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.width") }}
          </td>

          <td>
            {{ item.width }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.height") }}
          </td>

          <td>
            {{ item.height }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.weight") }}
          </td>

          <td>
            {{ item.weight }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.shipment") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('ShipmentShow')"
              :to="{ name: 'ShipmentShow', params: { id: item.shipment } }"
            >
              {{ item.shipment }}
            </router-link>

            <p v-else>
              {{ item.shipment }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.isPileUp") }}
          </td>

          <td>
            {{ item.isPileUp }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentloadinfos.packageType") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('ShipmentPackageTypeShow')"
              :to="{ name: 'ShipmentPackageTypeShow', params: { id: item.shipmentpackagetype } }"
            >
              {{ item.shipmentpackagetype }}
            </router-link>

            <p v-else>
              {{ item.shipmentpackagetype }}
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
import { useShipmentLoadInfosDeleteStore } from "@/store/shipmentloadinfos/delete";
import { useShipmentLoadInfosShowStore } from "@/store/shipmentloadinfos/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadinfosShowStore = useShipmentLoadInfosShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentloadinfosShowStore);

const shipmentloadinfosDeleteStore = useShipmentLoadInfosDeleteStore();
const { deleted, error: deleteError } = storeToRefs(shipmentloadinfosDeleteStore);

useMercureItem({
  store: shipmentloadinfosShowStore,
  deleteStore: shipmentloadinfosDeleteStore,
  redirectRouteName: "ShipmentLoadInfosList",
});
console.log(route.params.id);
await shipmentloadinfosShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    shipmentloadinfosDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentloadinfosDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ShipmentLoadInfosList" });
}

onBeforeUnmount(() => {
  shipmentloadinfosShowStore.$reset();
});
</script>
