import { defineStore } from "pinia";
import api from "@/utils/api";
import { PagedCollection } from "@/types/collection";
import { WalletTransactionData } from "@/types/wallet/transaction-data";
import { ListParams } from "@/types/list";

interface State {
  items: WalletTransactionData[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useWalletTransactionsStore = defineStore("walletTransactions", {
  state: (): State => ({
    items: [],
    totalItems: 0,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async getTransactions(params: ListParams) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("wallets/transactions", {
          params,
        });
        const data: PagedCollection<WalletTransactionData> =
          await response.json();

        this.toggleLoading();
        this.setItems(data["hydra:member"]);
        this.setTotalItems(data["hydra:totalItems"] ?? 0);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(items: WalletTransactionData[]) {
      this.items = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
