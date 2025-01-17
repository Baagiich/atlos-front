<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" closable>
      {{ error }}
    </v-alert>

    <v-data-table-virtual
      v-if="retrieved?.deviceLocation"
      :headers="headers"
      :items="retrieved?.deviceLocation"
      :loading="isLoading"
      height="200"
    >
      <template #item.createdAt="{ item }">
        <p>
          {{ formatDateTimeFull(item.createdAt) }}
        </p>
      </template>
      <template #item.location="{ item }">
        <p>
          {{ item.location.name }}, {{ item.location.street }},
          {{ item.location.country }}, {{ item.location.locality }}
        </p>
      </template>
      <template #item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="showOnMap(item)">
          mdi-dots-horizontal
        </v-icon>
      </template>
    </v-data-table-virtual>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { formatDateTimeFull } from "@/utils/date";
import { useShipmentDetailStore } from "@/store/shipment/detail";
import { useShipmentShowStore } from "@/store/shipment/show";

const { t } = useI18n();
const route = useRoute();
const shipmentDetailStore = useShipmentDetailStore();
const { retrieved, isLoading, error } = storeToRefs(shipmentDetailStore);

const selectedLocation = ref({});
const emit = defineEmits<{
  (e: "selected", value: any): void;
}>();
const shipmentShowStore = useShipmentShowStore();
await shipmentShowStore.retrieve(decodeURIComponent(route.params.id as string));
let headers = ref([
  {
    title: t("shipment.shipmentCode", {
      number: retrieved?.value?.shipmentCode,
    }),
    key: "createdAt",
    sortable: false,
  },
  {
    title: t("shipment.location"),
    key: "location",
    sortable: false,
  },
  {
    key: "actions",
    sortable: false,
  },
]);
async function sendRequest() {
  await shipmentDetailStore.retrieve(
    decodeURIComponent(route.params.id as string),
  );
  headers.value = Object.assign([], headers.value, [
    {
      title: t("shipment.shipmentCode") + " " + retrieved?.value?.shipmentCode,
      key: "createdAt",
      sortable: false,
    },
    {
      title: t("shipment.location"),
      key: "location",
      sortable: false,
    },
  ]);
}

sendRequest();

function showOnMap(row: any) {
  retrieved && retrieved.value?.deviceLocation
    ? retrieved.value.deviceLocation.map((item: any) => {
        item["@id"] === row["@id"]
          ? (selectedLocation.value = {
              lat: item["coordinate"]["latitude"],
              lng: item["coordinate"]["longitude"],
            })
          : null;
      })
    : null;

  emit("selected", selectedLocation.value);
}
onBeforeUnmount(() => {
  shipmentDetailStore.$reset();
});
</script>
