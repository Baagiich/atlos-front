<template>
  <Toolbar :breadcrumb="breadcrumb" />
  <ResultDialog
    :show="paymentCreated?.status == 4"
    :type="'success'"
    :message="$t('order.paymentSuccessMessage')"
    @close="closeDialog"
  ></ResultDialog>
  <v-container fluid>
    <v-alert v-if="errorPay" type="error" class="mb-4" :closable="true">
      {{ errorPay }}
    </v-alert>
    <v-alert
      v-if="validationError"
      type="error"
      class="mb-4"
      :closable="true"
      @click:close="validationError = ''"
    >
      {{ validationError }}
    </v-alert>
    <h2>{{ $t("order.checkoutTitle") }}</h2>
    <v-form ref="form" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="8">
          <v-table>
            <tbody>
              <tr>
                <td>{{ $t("order.number") }}</td>
                <td>{{ retrieved?.number }}</td>
              </tr>
              <tr>
                <td>{{ $t("order.shipmentName") }}</td>
                <td>{{ retrieved?.item.shipment.name }}</td>
              </tr>
              <tr>
                <td>{{ $t("order.product.name") }}</td>
                <td>{{ retrieved?.item.product.name }}</td>
              </tr>
              <tr>
                <td>{{ $t("status") }}</td>
                <td>
                  <v-chip v-if="retrieved?.paidAt" color="green">{{
                    $t("order.paid")
                  }}</v-chip>
                  <v-chip v-else>{{ $t("order.unpaid") }}</v-chip>
                </td>
              </tr>
              <tr>
                <td>{{ $t("currency.title") }}</td>
                <td>{{ retrieved?.totalAmount.currency }}</td>
              </tr>
              <tr>
                <td>{{ $t("amount") }}</td>
                <td>{{ retrieved?.totalAmount.amount }}</td>
              </tr>
              <tr>
                <td>{{ $t("quantity") }}</td>
                <td>{{ retrieved?.item.quantity }}</td>
              </tr>
              <tr>
                <td>
                  <strong>{{ $t("order.totalAmount") }}</strong>
                </td>
                <td>
                  <strong>{{ retrieved?.totalAmount.amount }}</strong>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-row v-if="retrieved && !retrieved?.paidAt" class="mt-6">
            <v-col cols="6">
              <v-select
                v-model="orderPaymentData.gatewayName"
                :label="$t('order.methodChoice')"
                :items="paymentMethods"
                item-title="name"
                item-value="value"
                variant="outlined"
                clearable
              >
              </v-select>
              <v-btn
                :disabled="!orderPaymentData.gatewayName || isLoadingRetrieve"
                :loading="isLoadingRetrieve"
                block
                class="text-none px-6"
                color="blue"
                variant="flat"
                size="large"
                @click="toggleConfirmDialog"
              >
                {{ $t("order.pay") }}
              </v-btn>
            </v-col>
            <v-col
              v-if="orderPaymentData.gatewayName == PaymentType.ATLOS_WALLET"
              cols="6"
            >
              <v-row>
                <v-col cols="4">
                  <span>{{ $t("wallet.account.availableBalance") }}</span>
                  <br />
                  <v-chip v-if="currencyAccount" icon="mdi-blinds"
                    >{{ currencyAccount.balance }}
                    {{ currencyAccount?.currency }}</v-chip
                  >
                  <v-btn
                    v-else
                    color="orange"
                    @click="router.push({ name: 'WalletList' })"
                  >
                    {{ $t("wallet.account.empty") }}
                  </v-btn>
                </v-col>
                <v-col cols="4">
                  <span>{{ $t("wallet.account.credit") }}</span>
                  <br />
                  <v-chip v-if="currencyAccount" icon="mdi-blinds"
                    >{{ currencyAccount.credit }}
                    {{ currencyAccount?.currency }}</v-chip
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <ConfirmDialog
      :show="confirmDelete"
      @cancel="toggleConfirmDialog"
      @confirm="submit"
    ></ConfirmDialog>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useWalletListStore } from "@/store/wallet/list";
import { useOrderPaymentStore } from "@/store/order/createpayment";
import { useOrderShowStore } from "@/store/order/show";
import { OrderPayment } from "@/types/orderpayment";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import ResultDialog from "@/components/common/ResultDialog.vue";
import { useRoute, useRouter } from "vue-router";
import Toolbar from "@/components/common/Toolbar.vue";
import { useBreadcrumb } from "@/composables/breadcrumb";
import { PaymentType } from "@/types/paymenttype";

const { t } = useI18n();
const validationError = ref("");
const confirmDelete = ref(false);
const route = useRoute();
const router = useRouter();
const breadcrumb = useBreadcrumb();

const paymentMethods = [
  {
    name: t("wallet.title"),
    value: PaymentType.ATLOS_WALLET,
  },
];

const walletListStore = useWalletListStore();
const { accounts } = storeToRefs(walletListStore);

const orderPaymentStore = useOrderPaymentStore();
const orderShowStore = useOrderShowStore();
const {
  created: paymentCreated,
  isLoading: isLoadingPay,
  error: errorPay,
} = storeToRefs(orderPaymentStore);

await walletListStore.getAccounts();

async function retrieveOrder() {
  await orderShowStore.retrieve({
    page: 1,
    groups: [
      "order_item:list",
      "product:read",
      "shipment:list",
      "money:read",
      "order:read",
    ],
    ...{ number: route.params.orderNumber as string },
  });
}

await retrieveOrder();

const {
  retrieved,
  isLoading: isLoadingRetrieve,
  error: errorRetrieve,
} = storeToRefs(orderShowStore);

const orderPaymentData: Ref<OrderPayment> = ref({});
orderPaymentData.value.order = retrieved?.value?.["@id"];

const currencyAccount = computed(() => {
  return accounts && retrieved
    ? accounts.value.find((obj) =>
        obj.currency === retrieved.value?.totalAmount.currency
          ? obj.balance
          : null,
      )
    : null;
});

async function submit() {
  toggleConfirmDialog();
  if (!currencyAccount.value) {
    validationError.value = t("wallet.account.empty");
    return;
  }
  if (!currencyAccount.value?.balance) {
    return;
  }

  if (!retrieved || !retrieved.value?.totalAmount) {
    return;
  }

  if (
    +currencyAccount.value?.balance + +currencyAccount.value?.credit <
    retrieved?.value?.totalAmount.amount
  ) {
    validationError.value = t("order.influenceBalance");
    return;
  }

  await orderPaymentStore.payOrder(orderPaymentData.value);

  if (!paymentCreated?.value) {
    return;
  }
}

function toggleConfirmDialog() {
  confirmDelete.value = !confirmDelete.value;
}

function closeDialog() {
  retrieveOrder();
  orderPaymentStore.$reset();
}
</script>
