<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
    <v-card>
      <v-card-text>
        <v-card-title>{{
          $t("wallet.account.withdraw.titleLong")
        }}</v-card-title>
        <v-select
          v-model="item.currency"
          :items="currencies"
          item-title="code"
          item-value="code"
          variant="outlined"
          :error="Boolean(violations?.currency)"
          :error-messages="violations?.currency"
          :label="$t('wallet.currency.choice')"
          :rules="currencyRules"
        >
        </v-select>
        <v-select
          v-model="item.toBank"
          :items="banks"
          item-title="name"
          item-value="code"
          variant="outlined"
          :error="Boolean(violations?.toBank)"
          :error-messages="violations?.toBank"
          :label="$t('wallet.account.withdraw.bankNameChoice')"
          :rules="bankRules"
        >
        </v-select>
        <v-text-field
          v-model="item.toAccount"
          type="text"
          variant="outlined"
          :error="Boolean(violations?.toAccount)"
          :error-messages="violations?.toAccount"
          :label="$t('wallet.account.withdraw.bankAccNo')"
          :rules="accountRules"
        >
        </v-text-field>
        <v-text-field
          v-model="item.toAccountName"
          variant="outlined"
          :error="Boolean(violations?.toAccountName)"
          :error-messages="violations?.toAccountName"
          :label="$t('wallet.account.withdraw.bankAccName')"
          :rules="accountNameRules"
        >
        </v-text-field>
        <v-text-field
          :model-value="selectedCurrencyAccount?.balance"
          type="number"
          variant="outlined"
          :readonly="true"
          :disabled="true"
        >
          <template #label>
            {{ $t("wallet.account.availableBalance") }}
          </template>
        </v-text-field>
        <v-text-field
          v-model="item.amount"
          type="number"
          variant="outlined"
          :error="Boolean(violations?.amount)"
          :error-messages="violations?.amount"
          :label="$t('wallet.transaction.amount')"
          :rules="amountRules"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" md="6"
          ><v-btn
            variant="flat"
            color="grey-lighten-3"
            size="large"
            block
            @click="setIsShowDialog(false)"
            >{{ $t("close") }}</v-btn
          ></v-col
        >
        <v-col cols="6" md="6"
          ><v-btn
            prepend-icon="mdi-check-circle"
            color="green-darken-1"
            variant="flat"
            size="large"
            block
            type="submit"
          >
            {{ $t("wallet.account.withdraw.title") }}</v-btn
          >
        </v-col>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, Ref, ref, toRef } from "vue";
import { WalletWithdraw } from "@/types/wallet/wallet-withdraw";
import { SubmissionErrors } from "@/types/error";
import { useWalletWithdrawStore } from "@/store/wallet/withdraw";
import { VForm } from "vuetify/components";
import { useWalletListStore } from "@/store/wallet/list";
import { Currency } from "@/types/currency";
import { Bank } from "@/types/bank";
import {
  assertMaxLength,
  assertMaxLengthNumber,
  assertNumber,
  assertRequired,
} from "@/validations";

const props = defineProps<{
  values?: WalletWithdraw;
  errors?: SubmissionErrors;
  currencies: Currency[];
  banks: Bank[];
}>();

const violations = toRef(props, "errors");
const walletWithdrawStore = useWalletWithdrawStore();
const walletListStore = useWalletListStore();

const { accounts } = storeToRefs(walletListStore);

const item: Ref<WalletWithdraw> = ref({});
const form: Ref<VForm | null> = ref(null);

const currencyRules = [assertRequired()];
const bankRules = [assertRequired()];
const accountRules = [
  assertRequired(),
  assertNumber(),
  assertMaxLengthNumber(12),
];
const accountNameRules = [assertRequired(), assertMaxLength(50)];
const amountRules = [assertRequired(), assertNumber()];

if (props.values) {
  item.value = {
    ...props.values,
  };
}

const selectedCurrencyAccount = computed(() => {
  return item.value.currency
    ? accounts.value.find((obj) => obj.currency === item.value.currency)
    : null;
});

const emit = defineEmits<{
  (e: "submit", item: WalletWithdraw): void;
}>();

async function emitSubmit() {
  if (!form.value) {
    return;
  }
  const { valid } = await form.value.validate();
  if (valid) {
    emit("submit", item.value);
  }
}

function setIsShowDialog(value: boolean) {
  walletWithdrawStore.setIsShowDialog(value);
}
</script>
