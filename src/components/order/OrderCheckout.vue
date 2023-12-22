<template>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
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
    <h2>{{ $t("order.title") }}</h2>
    <v-form ref="form" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="6">
          <v-table>
            <tbody>
              <tr>
                <td>{{ $t("order.id") }}</td>
                <td>{{ orderData.number }}</td>
              </tr>
              <tr>
                <td>{{ $t("order.product.name") }}</td>
                <td>{{ orderData.product }}</td>
              </tr>
              <tr>
                <td>{{ $t("currency.title") }}</td>
                <td>{{ orderData.currency }}</td>
              </tr>
              <tr>
                <td>{{ $t("amount") }}</td>
                <td>{{ orderData.amount }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <strong>{{ $t("order.totalAmount") }}</strong>
                </td>
                <td>
                  <strong>{{ orderData.amountTotal }}</strong>
                </td>
              </tr>
            </tfoot>
          </v-table>
          <v-row class="mt-6">
            <v-col cols="6">
              <v-select
                v-model="orderPaymentData.method"
                :label="$t('order.methodChoice')"
                :items="paymentMethods"
                item-title="name"
                item-value="value"
                variant="outlined"
                clearable
              >
              </v-select>
              <v-btn
                :disabled="!orderPaymentData.method || isLoading"
                :loading="isLoading"
                block
                class="text-none px-6"
                color="blue"
                variant="flat"
                size="large"
                type="submit"
              >
                {{ $t("order.pay") }}
              </v-btn>
            </v-col>
            <v-col v-if="orderPaymentData.method == 'wallet'" cols="6">
              <span>{{ $t("wallet.account.availableBalance") }}</span>
              <br />
              <v-chip icon="mdi-blinds"
                >{{ currencyAccount ? currencyAccount.balance : "" }}
                {{ orderData.currency }}</v-chip
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useWalletListStore } from "@/store/wallet/list";
import { useOrderPaymentStore } from "@/store/order/createpayment";
import { OrderPayment } from "@/types/orderpayment";

const { t } = useI18n();

const validationError = ref("");
const orderData = ref({
  currency: "CNY",
  number: "k2h38123j348s",
  product: "30% урьдчилгаа",
  amount: "150000",
  amountTotal: "150000",
});
const orderPaymentData: Ref<OrderPayment> = ref({});
orderPaymentData.value.orderIri = "iri";

const paymentMethods = [
  {
    name: t("wallet.title"),
    value: "wallet",
  },
];

const walletListStore = useWalletListStore();
const { accounts } = storeToRefs(walletListStore);

const orderPaymentStore = useOrderPaymentStore();
const {
  created: paymentCreated,
  isLoading,
  error,
} = storeToRefs(orderPaymentStore);

const currencyAccount = computed(() => {
  return accounts
    ? accounts.value.find((obj) =>
        obj.currency === orderData.value.currency ? obj.balance : null,
      )
    : null;
});

await walletListStore.getAccounts();

async function submit() {
  if (!currencyAccount.value?.balance) {
    return;
  }

  if (currencyAccount.value?.balance < orderData.value.amountTotal) {
    validationError.value = t("order.influenceBalance");
    return;
  }
  await orderPaymentStore.payOrder(orderPaymentData.value);

  if (!paymentCreated?.value) {
    return;
  }
}
</script>
