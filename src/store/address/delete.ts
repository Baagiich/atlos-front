import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Address } from "@/types/address";

interface State {
  deleted?: Address;
  mercureDeleted?: Address;
  isLoading: boolean;
  error?: string;
}

export const useAddressDeleteStore = defineStore("addressDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Address) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No address found. Please reload");
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

    setDeleted(deleted: Address) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Address | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
