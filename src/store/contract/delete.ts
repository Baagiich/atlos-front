import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Contract } from "@/types/contract";

interface State {
  deleted?: Contract;
  mercureDeleted?: Contract;
  isLoading: boolean;
  error?: string;
}

export const useContractDeleteStore = defineStore("contractDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Contract) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No contract found. Please reload");
        return;
      }

      try {
        await api(item["@id"], { method: "DELETE" });

        this.toggleLoading();
        this.setDeleted(item);
        this.setMercureDeleted(undefined);
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

    setDeleted(deleted: Contract) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Contract | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
