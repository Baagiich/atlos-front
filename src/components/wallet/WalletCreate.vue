<template>
  <v-alert v-if="error" type="error" class="mb-4" :closable="true">
    {{ error }}
  </v-alert>
  <v-alert
    v-if="isSuccess"
    type="success"
    class="mb-4"
    :closable="true"
    variant="tonal"
  >
    <template v-if="isSuccess">
      {{ $t("wallet.account.message.success") }}
    </template>
  </v-alert>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="selectedCurrency"
        :items="items"
        item-title="code"
        item-value="code"
        variant="outlined"
        clearable
      >
        <template #label>
          {{ $t("wallet.currency.choice") }}
        </template>
      </v-select>
    </v-col>
    <v-col cols="12" md="6">
      <v-btn
        :disabled="!selectedCurrency || isLoading"
        :loading="isLoading"
        block
        class="text-none px-6"
        color="blue-grey-darken-4"
        variant="flat"
        size="large"
        prepend-icon="mdi-plus"
        @click="createWallet"
      >
        {{ $t("wallet.account.create") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useWalletCreateStore } from "@/store/wallet/create";
import { useWalletListStore } from "@/store/wallet/list";
import { WalletCreate } from "@/types/wallet/wallet-create";
import { storeToRefs } from "pinia";

defineProps({
  items: { type: Array, default: null },
});

const walletCreateStore = useWalletCreateStore();
const walletListStore = useWalletListStore();
const { isSuccess, error, isLoading } = storeToRefs(walletCreateStore);
const selectedCurrency = ref("");

async function createWallet() {
  const payload = new WalletCreate();
  payload.currency = selectedCurrency.value;
  await walletCreateStore.create(payload);
  if (isSuccess) {
    await walletListStore.getAccounts();
    selectedCurrency.value = "";
  }
}
</script>
