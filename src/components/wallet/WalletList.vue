<template>
  <WalletDepositDialog></WalletDepositDialog>
  <WalletWithdrawDialog
    :currencies="linkedCurrencies"
    :banks="banks"
  ></WalletWithdrawDialog>
  <ResultDialog
    :show="isSuccessWithdraw"
    :type="'success'"
    :message="$t('wallet.account.withdraw.successfullyMessage')"
    @close="setWithdrawSuccess(false)"
  ></ResultDialog>
  <v-container fluid>
    <v-alert v-if="error" type="error" class="mb-4" :closable="true">
      {{ error }}
    </v-alert>
    <div>
      <h2>{{ $t("wallet.title") }}</h2>
      <v-row class="mt-3">
        <v-col cols="12" md="7">
          <template v-if="accounts && accounts.length > 0">
            <v-row>
              <v-col v-for="(account, index) in accounts" :key="index" md="4">
                <BalanceCard
                  :balance="account.balance"
                  :currency="account.currency"
                  :credit="account.credit"
                />
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <div class="text-center">
              <p class="grey-darken-1">{{ $t("wallet.account.empty") }}</p>
              <v-icon
                icon="mdi mdi-note-off-outline"
                size="60"
                color="grey-darken-1"
              ></v-icon>
            </div>
          </template>
        </v-col>
        <v-col cols="12" md="5">
          <WalletCreate
            :items="nonLinkedCurrencies"
            :is-loading="isLoadingCurrency"
          ></WalletCreate>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="12" md="6">
          <v-btn
            class="text-body-1"
            size="x-large"
            rounded="xl"
            elevation="4"
            :ripple="false"
            color="blue"
            append-icon="mdi-arrow-down-circle"
            @click="setIsShowDepositDialog(true)"
          >
            {{ $t("wallet.account.deposit.title") }}
          </v-btn>
          <v-btn
            class="text-body-1 ml-4"
            size="x-large"
            rounded="xl"
            elevation="4"
            :ripple="false"
            color="red"
            append-icon="mdi-arrow-up-circle"
            @click="setIsShowWithdrawDialog(true)"
          >
            {{ $t("wallet.account.withdraw.title") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="12">
          <p>{{ $t("wallet.transaction.title") }}</p>
          <TransactionList
            :headers="headers"
            :items="transactions"
            :total-items="transactionTotal"
            :is-loading="isLoadingTransaction"
            :items-per-page="transactions.length"
          ></TransactionList>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWalletListStore } from "@/store/wallet/list";
import { useCurrencyListStore } from "@/store/currency/list";
import { useWalletTransactionsStore } from "@/store/wallet/transactions";
import { useWalletDepositStore } from "@/store/wallet/deposit";
import { useWalletWithdrawStore } from "@/store/wallet/withdraw";
import { useBankListStore } from "@/store/bank/list";
import BalanceCard from "@/components/common/BalanceCard.vue";
import TransactionList from "@/components/wallet/TransactionList.vue";
import WalletCreate from "@/components/wallet/WalletCreate.vue";
import WalletDepositDialog from "@/components/wallet/WalletDepositDialog.vue";
import WalletWithdrawDialog from "@/components/wallet/WalletWithdrawDialog.vue";
import ResultDialog from "@/components/common/ResultDialog.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const walletListStore = useWalletListStore();
const currencyListStore = useCurrencyListStore();
const transactionListStore = useWalletTransactionsStore();
const walletDepositStore = useWalletDepositStore();
const walletWithdrawStore = useWalletWithdrawStore();
const bankListStore = useBankListStore();

const { accounts, error } = storeToRefs(walletListStore);
const { items: currencies, isLoading: isLoadingCurrency } =
  storeToRefs(currencyListStore);
const {
  items: transactions,
  isLoading: isLoadingTransaction,
  totalItems: transactionTotal,
} = storeToRefs(transactionListStore);
const { items: banks } = storeToRefs(bankListStore);

const { isSuccess: isSuccessWithdraw } = storeToRefs(walletWithdrawStore);

const transactionPage = ref("1");

const linkedCurrencies = computed(() => {
  return currencies
    ? currencies.value.filter((obj) =>
        accounts.value.some(({ currency }) => obj.code === currency),
      )
    : [];
});

const nonLinkedCurrencies = computed(() => {
  return currencies
    ? currencies.value.filter(
        (obj) => !accounts.value.some(({ currency }) => obj.code === currency),
      )
    : [];
});

async function sendRequestAccounts() {
  await walletListStore.getAccounts();
}

async function sendRequestCurrencies() {
  await currencyListStore.getItems({
    page: 1,
    page_size: 50,
  });
}

async function sendRequestTransactions() {
  await transactionListStore.getTransactions({
    page: +transactionPage.value,
    page_size: 20,
  });
}

async function sendRequestBanks() {
  await bankListStore.getItems({
    page: 1,
    page_size: 50,
  });
}

function setIsShowDepositDialog(value: boolean) {
  walletDepositStore.setIsShowDialog(value);
}

function setIsShowWithdrawDialog(value: boolean) {
  walletWithdrawStore.setIsShowDialog(value);
}

function setWithdrawSuccess(value: boolean) {
  walletWithdrawStore.setIsSuccess(value);
}

sendRequestAccounts();
sendRequestCurrencies();
sendRequestTransactions();
sendRequestBanks();

const headers = [
  { title: "№", key: "id" },
  {
    title: t("wallet.transaction.amount"),
    key: "amount",
    sortable: false,
  },
  {
    title: t("wallet.transaction.currency"),
    key: "currency",
    sortable: false,
  },
  {
    title: t("wallet.transaction.date"),
    key: "created_at",
    sortable: false,
  },
  {
    title: t("wallet.transaction.description"),
    key: "description",
    sortable: false,
  },
];
</script>
