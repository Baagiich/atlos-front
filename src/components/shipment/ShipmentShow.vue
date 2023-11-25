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
            {{ $t("shipment.shipmentImages") }}
          </td>

          <td>
            <template v-if="router.hasRoute('ShipmentImageShow')">
              <router-link
                v-for="shipmentimage in item.shipmentImages"
                :to="{ name: 'ShipmentImageShow', params: { id: shipmentimage } }"
                :key="shipmentimage"
              >
                {{ shipmentimage }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="shipmentimage in item.shipmentImages"
                :key="shipmentimage"
              >
                {{ shipmentimage }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.state") }}
          </td>

          <td>
            {{ item.state }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.driver") }}
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
        <tr>
          <td>
            {{ $t("shipment.action") }}
          </td>

          <td>
            {{ item.action }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.consignor") }}
          </td>

          <td>
            {{ item.consignor }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.shipmentCode") }}
          </td>

          <td>
            {{ item.shipmentCode }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.shipmentType") }}
          </td>

          <td>
            {{ item.shipmentType }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.shipmentShipperDeals") }}
          </td>

          <td>
            <template v-if="router.hasRoute('ShipmentShipperDealShow')">
              <router-link
                v-for="shipmentshipperdeal in item.shipmentShipperDeals"
                :to="{ name: 'ShipmentShipperDealShow', params: { id: shipmentshipperdeal } }"
                :key="shipmentshipperdeal"
              >
                {{ shipmentshipperdeal }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="shipmentshipperdeal in item.shipmentShipperDeals"
                :key="shipmentshipperdeal"
              >
                {{ shipmentshipperdeal }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.reviews") }}
          </td>

          <td>
            <template v-if="router.hasRoute('ReviewShow')">
              <router-link
                v-for="review in item.reviews"
                :to="{ name: 'ReviewShow', params: { id: review } }"
                :key="review"
              >
                {{ review }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="review in item.reviews"
                :key="review"
              >
                {{ review }}
              </p>
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.shipper") }}
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
            {{ $t("shipment.fromAddress") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('AddressShow')"
              :to="{ name: 'AddressShow', params: { id: item.fromAddress } }"
            >
            {{ item.fromAddress.city.name }}, {{ item.fromAddress.street }}
            </router-link>

            <p v-else>
              {{ item.fromAddress.city.name }}, {{ item.fromAddress.street }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.toAddress") }}
          </td>

          <td>
            <router-link
              v-if="router.hasRoute('AddressShow')"
              :to="{ name: 'AddressShow', params: { id: item.toAddress } }"
            >
            {{ item.toAddress.city.name }}, {{ item.toAddress.street }}
            </router-link>

            <p v-else>
            {{ item.toAddress.city.name }}, {{ item.toAddress.street }}

            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.loadAt") }}
          </td>

          <td>
            {{ formatDateTime(item.loadAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.unloadAt") }}
          </td>

          <td>
            {{ formatDateTime(item.unloadAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.prePayment") }}
          </td>

          <td>
            {{ item.prePayment }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.postPayment") }}
          </td>

          <td>
            {{ item.postPayment }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.price") }}
          </td>

          <td>
            {{ item.price }}
                      </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.updatedAt") }}
          </td>

          <td>
            {{ formatDateTime(item.updatedAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.createdAt") }}
          </td>

          <td>
            {{ formatDateTime(item.createdAt) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("shipment.shipmentTypeCode") }}
          </td>

          <td>
            {{ item.shipmentTypeCode }}
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
import { useShipmentDeleteStore } from "@/store/shipment/delete";
import { useShipmentShowStore } from "@/store/shipment/show";
import { formatDateTime } from "@/utils/date";
import { useBreadcrumb } from "@/composables/breadcrumb";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const shipmentShowStore = useShipmentShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(shipmentShowStore);

const shipmentDeleteStore = useShipmentDeleteStore();
const { deleted, error: deleteError } = storeToRefs(shipmentDeleteStore);

useMercureItem({
  store: shipmentShowStore,
  deleteStore: shipmentDeleteStore,
  redirectRouteName: "ShipmentList",
});

await shipmentShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    shipmentDeleteStore.setError(t("itemNotFound"));
    return;
  }

  await shipmentDeleteStore.deleteItem(item.value);

  if (!deleted?.value) {
    return;
  }

  router.push({ name: "ShipmentList" });
}

onBeforeUnmount(() => {
  shipmentShowStore.$reset();
});
</script>
