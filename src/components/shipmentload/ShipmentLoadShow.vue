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
            {{ $t("shipmentload.name") }}
          </td>

          <td>
            {{ item.name }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.quantity") }}
          </td>

          <td>
            {{ item.quantity }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.length") }}
          </td>

          <td>
            {{ item.length }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.width") }}
          </td>

          <td>
            {{ item.width }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.height") }}
          </td>

          <td>
            {{ item.height }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.weight") }}
          </td>

          <td>
            {{ item.weight }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipmentload.shipment") }}
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
            {{ $t("shipmentload.packageType") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('PackageTypeShow')"
              :to="{ name: 'PackageTypeShow', params: { id: item.packagetype } }"
            >
              {{ item.packagetype }}
            </router-link>

            <p v-else>
              {{ item.packagetype }}
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
import { useShipmentLoadDeleteStore } from "@/store/shipmentload/delete";
import { useShipmentLoadShowStore } from "@/store/shipmentload/show";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentloadShowStore = useShipmentLoadShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentloadShowStore);

const shipmentloadDeleteStore = useShipmentLoadDeleteStore();
const { deleted, error: deleteError } = storeToRefs(shipmentloadDeleteStore);

useMercureItem({
  store: shipmentloadShowStore,
  deleteStore: shipmentloadDeleteStore,
  redirectRouteName: "ShipmentLoadList",
});

await shipmentloadShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    shipmentloadDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentloadDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ShipmentLoadList" });
}

onBeforeUnmount(() => {
  shipmentloadShowStore.$reset();
});
</script>
