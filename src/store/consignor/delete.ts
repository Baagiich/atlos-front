import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Consignor } from "@/types/consignor";

interface State {
  deleted?: Consignor;
  mercureDeleted?: Consignor;
  isLoading: boolean;
  error?: string;
}

export const useConsignorDeleteStore = defineStore("consignorDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Consignor) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No consignor found. Please reload");
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

    setDeleted(deleted: Consignor) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Consignor | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
