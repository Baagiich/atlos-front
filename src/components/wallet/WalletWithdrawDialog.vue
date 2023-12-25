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
import { useWalletWithdrawStore } from "@/store/wallet/withdraw";
import { storeToRefs } from "pinia";
import { WalletWithdraw } from "@/types/wallet/wallet-withdraw";
import Form from "@/components/wallet/WalletWithdrawForm.vue";

defineProps({
  banks: {
    type: Array,
    default: undefined,
  },
  currencies: { type: Array, default: undefined },
});

const walletWithdrawStore = useWalletWithdrawStore();

const { created, isShowDialog, violations } = storeToRefs(walletWithdrawStore);

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
