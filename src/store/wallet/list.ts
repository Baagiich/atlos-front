import { defineStore } from "pinia";
import api from "@/utils/api";
import type { WalletAccount } from "@/types/wallet/wallet";
import { PagedCollection } from "@/types/collection";
import { WalletTransactionData } from "@/types/wallet/transaction-data";
import { ListParams } from "@/types/list";

interface State {
  accounts: WalletAccount[];
  transactions: WalletTransactionData[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
  isShowWithdrawDialog: boolean;
}

export const useWalletListStore = defineStore("wallet", {
  state: (): State => ({
    accounts: [],
    transactions: [],
    totalItems: 0,
    isLoading: false,
    error: undefined,
    isShowWithdrawDialog: false,
  }),

  actions: {
    async getAccounts() {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("wallets");
        const data: PagedCollection<WalletAccount> = await response.json();

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
        this.setTransactions(data["hydra:member"]);
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

    setItems(items: WalletAccount[]) {
      this.accounts = items;
    },

    setTransactions(items: WalletTransactionData[]) {
      this.transactions = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setError(error: string) {
      this.error = error;
    },

    setIsShowWithdrawDialog(value: boolean) {
      this.isShowWithdrawDialog = value;
    },
  },
});
