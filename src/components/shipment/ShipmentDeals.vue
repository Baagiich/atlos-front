<template>
  <div>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <v-alert v-if="patchError" type="error" class="mb-4" :closable="true">
      {{ patchError }}
    </v-alert>
    <v-alert v-if="createError" type="error" class="mb-4" :closable="true">
      {{ createError }}
    </v-alert>
    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="isLoading"
      :items-per-page="items.length"
      class="shipment-load-infos-table"
      @update:page="updatePage"
      @update:sortBy="updateOrder"
    >
      <template #item.name="{ item }">
        <p>
          {{ item.shipper.firstName }}
        </p>
      </template>
      <template #item.reviews="{ item }">
        <span class="text-grey-lighten text-caption me-2">
          ({{ getAverageReview(item) }})
        </span>

        <v-rating
          :model-value="getAverageReview(item)"
          color="grey"
          active-color="yellow-accent-4"
          half-increments
          readonly
          size="18"
        ></v-rating>
      </template>
      <template #item.bidPrice="{ item }">
        <p>
          {{
            Array.isArray(item.shipmentPriceBiddings) &&
            item.shipmentPriceBiddings.length > 0 &&
            item.shipmentPriceBiddings[0].price
              ? item.shipmentPriceBiddings[0].price.amount
              : "-"
          }}
        </p>
      </template>
      <template #item.replyBidPrice="{ item }">
        <p>
          {{
            Array.isArray(item.shipmentPriceBiddings) &&
            item.shipmentPriceBiddings.length === 2 &&
            item.shipmentPriceBiddings[1].price
              ? item.shipmentPriceBiddings[1].price.amount
              : "-"
          }}
        </p>
      </template>
      <template #item.state="{ item }">
        <p>
          {{ getStatus(item.status) }}
        </p>
      </template>
      <template #item.action="{ item }">
        <p>
          <v-dialog v-model="dialogApprove" width="auto">
            <template #activator="{ props }">
              <v-btn
                color="green"
                :disabled="item.status !== DealType.PENDING"
                v-bind="props"
                size="small"
                @click="approveItem = item"
              >
                {{ t("shipment.accept") }}
              </v-btn>
            </template>
            <v-card class="shipment-deal-card">
              <h4>
                {{ t("shipment.wantApprove") }}
              </h4>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                variant="outlined"
                size="small"
                @click="dialogApprove = false"
              >
                {{ t("shipment.back") }}
              </v-btn>
              <v-btn
                color="green"
                variant="flat"
                size="small"
                @click="approveBid()"
              >
                {{ t("shipment.approve") }}
              </v-btn>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog" width="auto">
            <template #activator="{ props }">
              <v-btn
                :disabled="item.status !== DealType.PENDING"
                color="primary"
                v-bind="props"
                class="send-bid-btn"
                size="small"
                @click="(dialogItem = item), (bidPrice = undefined)"
              >
                {{ t("shipment.sendBid") }}
              </v-btn>
            </template>
            <v-card>
              <h4>
                {{ t("shipment.sendBidTitle") }}
              </h4>
              <v-spacer></v-spacer>
              <div
                v-if="
                  Array.isArray(dialogItem.shipmentPriceBiddings) &&
                  dialogItem.shipmentPriceBiddings[0].price
                "
              >
                {{ dialogItem.shipmentPriceBiddings[0].price.amount }}
              </div>
              <v-text-field
                v-model="bidPrice"
                type="number"
                variant="outlined"
                clearable
                :placeholder="$t('shipment.sendNewPriceBid')"
              >
              </v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                color="green-darken-1"
                variant="text"
                size="small"
                @click="createShipmentPriceBidding()"
              >
                {{ t("shipment.send") }}
              </v-btn>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogCancel" width="auto">
            <template #activator="{ props }">
              <v-btn
                color="red"
                :disabled="
                  item.status !== DealType.PENDING &&
                  item.status !== DealType.REPLIED
                "
                v-bind="props"
                size="small"
                @click="cancelItem = item"
              >
                {{ t("shipment.cancel") }}
              </v-btn>
            </template>
            <v-card class="shipment-deal-card">
              <h4>
                {{ t("shipment.wantCancel") }}
              </h4>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                variant="outlined"
                size="small"
                @click="dialogCancel = false"
              >
                {{ t("shipment.back") }}
              </v-btn>
              <v-btn
                color="red"
                variant="flat"
                size="small"
                @click="cancelBid()"
              >
                {{ t("shipment.cancel") }}
              </v-btn>
            </v-card>
          </v-dialog>
        </p>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useShipmentShipperDealListStore } from "@/store/shipmentshipperdeal/list";
import type { Filters, VuetifyOrder } from "@/types/list";
import { Ref } from "vue";
import { DealType } from "@/types/deal_type";
import { useShipmentPriceBiddingPathcStore } from "@/store/shipmentpricebidding/patch";
import { ShipmentPriceBiddingPatch } from "@/types/shipmentpricebiddingpatch";
import { ShipmentShipperDeal } from "@/types/shipmentshipperdeal";
import { BiddingType } from "@/types/bidding_type";
import { ShipmentPriceBidding } from "@/types/shipmentpricebidding";
import { useShipmentPriceBiddingCreateStore } from "@/store/shipmentpricebidding/create";
import isString from "lodash/isString";
import { useShipmentShowStore } from "@/store/shipment/show";
import router from "@/router";

const { t } = useI18n();
const route = useRoute();
const props2 = defineProps<{
  currency: string;
}>();
const currency = ref(props2.currency);
const useDealListStore = useShipmentShipperDealListStore();
const { items, totalItems, error, isLoading } = storeToRefs(useDealListStore);
const dialog = ref(false);
const dialogApprove = ref(false);
const dialogCancel = ref(false);
const page = ref(1);
const order = ref({});
const itemsPerPage = ref("10");
const filters: Ref<Filters> = ref({});
const dialogItem: Ref<ShipmentShipperDeal> = ref({});
const approveItem: Ref<ShipmentShipperDeal> = ref({});
const cancelItem: Ref<ShipmentShipperDeal> = ref({});
const shipmentpricebiddingpatch: Ref<ShipmentPriceBiddingPatch> = ref({});
const shipmentpricebidding: Ref<ShipmentPriceBidding> = ref({});

const biddingPatchStore = useShipmentPriceBiddingPathcStore();
const { created: patch, error: patchError } = storeToRefs(biddingPatchStore);
const biddingCreateStore = useShipmentPriceBiddingCreateStore();
const { created, error: createError } = storeToRefs(biddingCreateStore);

const shipmentShowStore = useShipmentShowStore();
const { retrieved: shipmentItem } = storeToRefs(shipmentShowStore);

const bidPrice: Ref<number | undefined> = ref(undefined);

filters.value.shipment = isString(route.params.id) ? route.params.id : "";

async function sendRequest() {
  await useDealListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    groups: ["adminUser:list", "shipment:deal", "shipmentShipperDeal:list"],
    ...filters.value,
  });
}

sendRequest();
function getStatus(code?: number) {
  if (code == DealType.PENDING) {
    return t("shipment.pending");
  } else if (code == DealType.COMPLETED) {
    return t("shipment.completed");
  } else if (code == DealType.CANCELLED) {
    return t("shipment.cancelled");
  } else if (code == DealType.REPLIED) {
    return t("shipment.replied");
  }

  return t("shipment.unknown");
}
function getAverageReview(shipmentDeal: ShipmentShipperDeal) {
  if (!shipmentDeal.shipper || Array.isArray(shipmentDeal.shipper.review)) {
    return 0;
  }

  return shipmentDeal.shipper.review.average;
}
function getShipmentPriceBiddingId(item: ShipmentPriceBidding) {
  const iri = item["@id"];
  return iri ? iri.replace("/api/shipment_price_biddings/", "") : "";
}
async function approveBid() {
  const item = approveItem.value;
  if (
    !item.shipmentPriceBiddings ||
    !Array.isArray(item.shipmentPriceBiddings)
  ) {
    return;
  }
  const id = getShipmentPriceBiddingId(item.shipmentPriceBiddings[0]);
  shipmentpricebiddingpatch.value.id = id;
  shipmentpricebiddingpatch.value.state = BiddingType.APPROVED;
  await biddingPatchStore.create(shipmentpricebiddingpatch.value);
  dialogApprove.value = false;

  if (patch && patch.value?.state === "approved") {
    await shipmentShowStore.retrieve(
      decodeURIComponent(route.params.id as string),
    );

    if (!shipmentItem || !shipmentItem.value) {
      return;
    }

    router.push({
      name: "OrderCheckout",
      params: { orderNumber: shipmentItem.value.advanceOrderNumber },
    });
  }
}
async function cancelBid() {
  const item = cancelItem.value;
  if (
    !item.shipmentPriceBiddings ||
    !Array.isArray(item.shipmentPriceBiddings)
  ) {
    return;
  }
  const id = getShipmentPriceBiddingId(item.shipmentPriceBiddings[0]);
  shipmentpricebiddingpatch.value.id = id;
  shipmentpricebiddingpatch.value.state = BiddingType.CANCELLED;
  await biddingPatchStore.create(shipmentpricebiddingpatch.value);
  dialogCancel.value = false;
  if (patch) {
    sendRequest();
  }
}
async function createShipmentPriceBidding() {
  shipmentpricebidding.value.shipment = dialogItem.value.shipment["@id"];
  shipmentpricebidding.value.price = {
    amount: bidPrice?.value === undefined ? undefined : +bidPrice?.value,
    currency: currency.value,
  };
  shipmentpricebidding.value.shipmentDeal = dialogItem.value["@id"];
  shipmentpricebidding.value.type = "reply";
  await biddingCreateStore.create(shipmentpricebidding.value);
  dialog.value = false;
  bidPrice.value = undefined;
  if (created) {
    sendRequest();
  }
}
const headers = [
  {
    title: t("shipment.name"),
    key: "name",
    sortable: false,
  },
  {
    title: t("shipment.reviews"),
    key: "reviews",
    sortable: false,
  },
  {
    title: t("shipment.bidPrice"),
    key: "bidPrice",
    sortable: false,
  },
  {
    title: t("shipment.replyBidPrice"),
    key: "replyBidPrice",
    sortable: false,
  },
  {
    title: t("shipment.state"),
    key: "state",
    sortable: false,
  },
  {
    title: t("shipment.action"),
    key: "action",
    sortable: false,
  },
];

function updatePage(newPage: number) {
  page.value = newPage;

  sendRequest();
}

function updateOrder(newOrders: VuetifyOrder[]) {
  const newOrder = newOrders[0];
  order.value = { [newOrder.key]: newOrder.order };

  sendRequest();
}
</script>
<style lang="scss">
.send-bid-btn {
  margin: 0 10px;
}
.shipment-load-infos-table {
  background: #f8f8f8;
  text-align: center;
  color: #000;
  thead {
    th {
      div {
        display: flow;
        font-weight: bold;
        text-align: center;
      }
    }
  }
}
.shipment-deal-card {
  width: 377.561px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 25px !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
}
</style>
