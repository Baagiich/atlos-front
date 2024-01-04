<template>
  <v-dialog v-model="isShowDialog" width="500">
    <v-card>
      <v-card-text>
        <v-card-title>{{
          $t("wallet.account.deposit.titleLong")
        }}</v-card-title>
        <v-table>
          <tbody>
            <tr>
              <td>{{ $t("wallet.currency.name") }} |</td>
              <td>
                <v-select
                  v-model="selectedCurrencyCode"
                  :items="currencies"
                  item-title="code"
                  item-value="code"
                  variant="outlined"
                >
                  <template #label>
                    {{ $t("wallet.currency.choice") }}
                  </template>
                </v-select>
              </td>
            </tr>
            <tr>
              <td>{{ $t("wallet.account.deposit.bankAccNo") }} |</td>
              <td>
                <strong>{{ selectedAccountInfo?.bankAccountNo }}</strong>
              </td>
            </tr>
            <tr>
              <td>{{ $t("wallet.account.deposit.bankAccName") }} |</td>
              <td>
                <strong class="text-uppercase">{{
                  selectedAccountInfo?.bankAccountName
                }}</strong>
              </td>
            </tr>
            <tr>
              <td>{{ $t("wallet.account.deposit.bankName") }} |</td>
              <td>
                <strong class="text-uppercase">{{
                  selectedAccountInfo ? selectedAccountInfo.bankName : ""
                }}</strong>
              </td>
            </tr>
            <tr>
              <td>{{ $t("wallet.transaction.description") }} |</td>
              <td><strong>user@gmail.com</strong></td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="setIsShowDialog(false)">{{ $t("close") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCurrencyListStore } from "@/store/currency/list";
import { useWalletDepositStore } from "@/store/wallet/deposit";
import { WalletDepositAccountInfo } from "@/types/wallet/wallet-deposit-account-info";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { computed, ref } from "vue";
const currencyListStore = useCurrencyListStore();
const walletDepositStore = useWalletDepositStore();

const { items: currencies } = storeToRefs(currencyListStore);
const { isShowDialog, depositAccountInfos } = storeToRefs(walletDepositStore);

const selectedCurrencyCode: Ref<string> = ref("MNT");

function setIsShowDialog(value: boolean) {
  walletDepositStore.setIsShowDialog(value);
}

const selectedAccountInfo = computed(() => {
  return selectedCurrencyCode.value
    ? depositAccountInfos.value.find(
        (obj: WalletDepositAccountInfo) =>
          obj.currency === selectedCurrencyCode.value,
      )
    : undefined;
});
</script>
