import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Currency } from "@/types/currency";

interface State {
  deleted?: Currency;
  isLoading: boolean;
  error?: string;
}

export const useCurrencyDeleteStore = defineStore("currencyDelete", {
  state: (): State => ({
    deleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Currency) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No found. Please reload");
        return;
      }

      try {
        await api(item["@id"], { method: "DELETE" });

        this.toggleLoading();
        this.setDeleted(item);
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

    setDeleted(deleted: Currency) {
      this.deleted = deleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
