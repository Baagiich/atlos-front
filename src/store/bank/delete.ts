import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Bank } from "@/types/bank";

interface State {
  deleted?: Bank;
  isLoading: boolean;
  error?: string;
}

export const useBankDeleteStore = defineStore("bankDelete", {
  state: (): State => ({
    deleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Bank) {
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

    setDeleted(deleted: Bank) {
      this.deleted = deleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
