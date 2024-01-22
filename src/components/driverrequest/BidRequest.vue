<template>
  <v-row>
    <h4>{{ $t("driverrequest.sendBid") }}</h4>
    <v-text-field
      v-model="bidPrice"
      type="number"
      :disabled="!checkRequests || btn2 || btn3 || btn4 || btn5"
      variant="outlined"
      clearable
    >
    </v-text-field>
    <div>{{ currency }}</div>
    <div>
      <v-btn v-if="btn1" :disabled="!checkRequests" @click="createBid">{{
        $t("driverrequest.sendRequest")
      }}</v-btn>
    </div>
    <div>
      <v-btn v-if="btn2" variant="text" color="blue">{{
        $t("driverrequest.sent")
      }}</v-btn>
    </div>

    <div v-if="btn3">
      <v-btn variant="outlined" color="green" @click="approveBid">{{
        $t("driverrequest.accept")
      }}</v-btn>
      <v-btn variant="outlined" color="red" @click="cancelBid">{{
        $t("driverrequest.cancel")
      }}</v-btn>
    </div>
    <div>
      <v-btn v-if="btn4" variant="text" color="green">{{
        $t("driverrequest.approved")
      }}</v-btn>
    </div>
    <div>
      <v-btn v-if="btn5" variant="text" color="red">{{
        $t("driverrequest.cancelled")
      }}</v-btn>
    </div>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { storeToRefs } from "pinia";
import { useDriverRequestsListStore } from "@/store/driverrequests/driverlist";
import { useVehicleRequestsListStore } from "@/store/driverrequests/vehiclelist";
import { RequestsType } from "@/types/requests_type";
import { useShipmentPriceBiddingCreateStore } from "@/store/shipmentpricebidding/create";
import { useShipmentPriceBiddingPathcStore } from "@/store/shipmentpricebidding/patch";
import { useShipmentShipperDealCreateStore } from "@/store/shipmentshipperdeal/create";
import { useShipmentShipperDealListStore } from "@/store/shipmentshipperdeal/list";
import { ShipmentPriceBidding } from "@/types/shipmentpricebidding";
import { ShipmentPriceBiddingPatch } from "@/types/shipmentpricebiddingpatch";
import { ShipmentShipperDeal } from "@/types/shipmentshipperdeal";
import { BiddingType } from "@/types/bidding_type";
import { DealType } from "@/types/deal_type";
import * as apiToken from "@/utils/apiToken";
import { Filters } from "@/types/list";
import isNumber from "lodash/isNumber";

const props = defineProps<{
  currency?: string;
  shipmentid?: string;
}>();
const currency = ref(props.currency);
const shipmentId = ref(props.shipmentid);
const biddingCreateStore = useShipmentPriceBiddingCreateStore();
const biddingPatchStore = useShipmentPriceBiddingPathcStore();
const dealCreateStore = useShipmentShipperDealCreateStore();
const { created: dealCreate } = storeToRefs(dealCreateStore);
const shipmentpricebidding: Ref<ShipmentPriceBidding> = ref({});
const shipmentpricebiddingpatch: Ref<ShipmentPriceBiddingPatch> = ref({});
const shipmentShipperDeal: Ref<ShipmentShipperDeal> = ref({});
const bidPrice: Ref<number> = ref(0);
const pendingBiddingId: Ref<string> = ref("");
const btn1 = ref(false);
const btn2 = ref(false);
const btn3 = ref(false);
const btn4 = ref(false);
const btn5 = ref(false);

const requestsListStore = useDriverRequestsListStore();
const { items: requestItems, totalItems: requestTotalItems } =
  storeToRefs(requestsListStore);
const requestsVehicleListStore = useVehicleRequestsListStore();
const { items: requestVehicleItems, totalItems: requestVehicleTotalItems } =
  storeToRefs(requestsVehicleListStore);
const shipmentDealListStore = useShipmentShipperDealListStore();
const { items: dealItems, totalItems: dealtotalItems } = storeToRefs(
  shipmentDealListStore,
);
const page = ref(1);
const filters: Ref<Filters> = ref({});
if (shipmentId.value) {
  filters.value.shipment = shipmentId.value.toString();
}

const tokenPayload = apiToken.getDecodedToken();
if (tokenPayload) {
  filters.value.shipper = tokenPayload.iri;
}
const order = ref({});
const itemsPerPage = ref("10");
async function getDeals() {
  await shipmentDealListStore.getItems({
    page: +page.value,
    order: order.value,
    page_size: +itemsPerPage.value,
    ...filters.value,
  });
}
await getDeals();
async function setBidPrice() {
  if (
    dealtotalItems.value > 0 &&
    dealItems.value[0] &&
    dealItems.value[0].price &&
    isNumber(dealItems.value[0].price?.amount)
  ) {
    bidPrice.value = dealItems.value[0].price.amount;
  }
}
await setBidPrice();
async function buttonToggle() {
  // Tsaash urgeljlehgui bhar ni comment bolgov
  // if (!dealItems.value[0] || !dealItems.value[0].shipmentPriceBiddings) {
  //   return;
  // }
  btn1.value = dealtotalItems.value == 0;
  btn2.value =
    dealtotalItems.value > 0 &&
    dealItems.value[0].shipmentPriceBiddings?.length !== 2;

  const replied = checkReply();
  if (
    replied &&
    Array.isArray(dealItems.value[0].shipmentPriceBiddings) &&
    dealItems.value[0].shipmentPriceBiddings[1].price &&
    isNumber(dealItems.value[0].shipmentPriceBiddings[1].price.amount)
  ) {
    btn3.value = replied;
    bidPrice.value = dealItems.value[0].shipmentPriceBiddings[1].price.amount;
  }
  if (dealtotalItems.value > 0) {
    btn4.value = dealItems.value[0].status === DealType.COMPLETED;
    btn5.value = dealItems.value[0].status === DealType.CANCELLED;
  }
}
await buttonToggle();
function checkReply() {
  if (
    dealtotalItems.value > 0 &&
    dealItems.value[0] &&
    Array.isArray(dealItems.value[0].shipmentPriceBiddings) &&
    dealItems.value[0].shipmentPriceBiddings.length === 2 &&
    dealItems.value[0].status === DealType.PENDING
  ) {
    const iri = dealItems.value[0].shipmentPriceBiddings[1]["@id"];
    if (!iri) {
      return false;
    }

    pendingBiddingId.value = iri.replace("/api/shipment_price_biddings/", "");
    return true;
  }
  return false;
}

const checkRequests = computed(() => {
  if (requestTotalItems.value > 0 && requestVehicleTotalItems.value > 0) {
    if (
      requestItems.value[0].type == RequestsType.APPROVED &&
      requestVehicleItems.value[0].type == RequestsType.APPROVED
    ) {
      return true;
    }
    return false;
  }
  return false;
});
async function createShipmentShipperDeal() {
  if (checkRequests.value) {
    shipmentShipperDeal.value.shipment = shipmentId.value;
    (shipmentShipperDeal.value.shipper = apiToken.getDecodedToken()?.iri),
      (shipmentShipperDeal.value.price = {
        amount: +bidPrice.value,
        currency: currency.value,
      });
    shipmentShipperDeal.value.driverUser = requestItems.value[0].toUser["@id"];
    shipmentShipperDeal.value.vehicle =
      requestVehicleItems.value[0].params?.iri;
    await dealCreateStore.create(shipmentShipperDeal.value);
  }
}
async function createShipmentPriceBidding() {
  shipmentpricebidding.value.shipment = shipmentId.value;
  shipmentpricebidding.value.price = {
    amount: +bidPrice.value,
    currency: currency.value,
  };
  shipmentpricebidding.value.shipmentDeal = dealCreate?.value?.["@id"];

  await biddingCreateStore.create(shipmentpricebidding.value);
}
async function createBid() {
  await createShipmentShipperDeal();
  await createShipmentPriceBidding();
  await getDeals();
  await buttonToggle();
}
async function cancelBid() {
  if (!checkReply()) {
    console.error("Cannot Cancel Bid");
    return;
  }
  shipmentpricebiddingpatch.value.id = pendingBiddingId.value;
  shipmentpricebiddingpatch.value.state = BiddingType.CANCELLED;
  await biddingPatchStore.create(shipmentpricebiddingpatch.value);
  await getDeals();
  await buttonToggle();
}
async function approveBid() {
  if (!checkReply()) {
    console.error("Cannot approve Bid");
    return;
  }
  shipmentpricebiddingpatch.value.id = pendingBiddingId.value;
  shipmentpricebiddingpatch.value.state = BiddingType.APPROVED;
  await biddingPatchStore.create(shipmentpricebiddingpatch.value);
  await getDeals();
  await buttonToggle();
}
</script>
