<template>
  <v-dialog v-model="isSuccess" width="500">
    <v-sheet class="position-relative">
      <v-fade-transition hide-on-leave>
        <v-card
          append-icon="$close"
          class="mx-auto"
          elevation="16"
          max-width="500"
        >
          <template v-slot:title>
            {{ $t("wallet.account.withdraw.title") }}
          </template>
          <template v-slot:append>
            <v-btn
              icon="$close"
              variant="text"
              @click="setIsSuccess(false)"
            ></v-btn>
          </template>

          <v-divider></v-divider>

          <div class="py-12 text-center">
            <v-icon
              class="mb-6"
              color="success"
              icon="mdi-check-circle-outline"
              size="128"
            ></v-icon>

            <div class="text-h4 font-weight-bold">
              {{ $t("wallet.account.withdraw.successfullyMessage") }}
            </div>
          </div>

          <v-divider></v-divider>

          <div class="pa-4 text-end">
            <v-btn
              class="text-none"
              color="medium-emphasis"
              min-width="92"
              rounded
              variant="outlined"
              @click="setIsSuccess(false)"
            >
              Close
            </v-btn>
          </div>
        </v-card>
      </v-fade-transition>
    </v-sheet>
  </v-dialog>
</template>
<script setup lang="ts">
import { useWalletWithdrawStore } from "@/store/wallet/withdraw";
import { storeToRefs } from "pinia";
const walletWithdrawStore = useWalletWithdrawStore();
const { isSuccess } = storeToRefs(walletWithdrawStore);

function setIsSuccess(value: boolean) {
  walletWithdrawStore.setIsSuccess(value);
}
</script>
