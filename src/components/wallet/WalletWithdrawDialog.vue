<template>
  <v-dialog v-model="isShowDialog" width="500">
    <Form
      :currencies="currencies"
      :banks="banks"
      :errors="violations"
      @submit="submitWithdraw"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { useCurrencyListStore } from "@/store/currency/list";
import { useBankListStore } from "@/store/bank/list";
import { useWalletWithdrawStore } from "@/store/wallet/withdraw";
import { storeToRefs } from "pinia";
import { computed, Ref, ref } from "vue";
import { WalletWithdraw } from "@/types/wallet/wallet-withdraw";
import { SubmissionErrors } from "@/types/error";
import Form from "@/components/wallet/WalletWithdrawForm.vue";
import { useRouter } from "vue-router";
import { useWalletListStore } from "@/store/wallet/list";

const router = useRouter();
const currencyListStore = useCurrencyListStore();
const bankListStore = useBankListStore();
const walletWithdrawStore = useWalletWithdrawStore();
const walletListStore = useWalletListStore();

const { items: currencies } = storeToRefs(currencyListStore);
const { items: banks } = storeToRefs(bankListStore);
const { created, isShowDialog, violations, isLoading } =
  storeToRefs(walletWithdrawStore);

async function sendRequestBanks() {
  await bankListStore.getItems({
    page: 1,
    page_size: 50,
  });
}

sendRequestBanks();

async function submitWithdraw(item: WalletWithdraw) {
  await walletWithdrawStore.withdraw(item);

  if (!created?.value) {
    return;
  }

  if (created.value.success === true) {
    walletWithdrawStore.setIsShowDialog(false);
    walletWithdrawStore.setIsSuccess(true);
  }
}
</script>
