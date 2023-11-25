import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Driver } from "@/types/driver";

interface State {
  deleted?: Driver;
  mercureDeleted?: Driver;
  isLoading: boolean;
  error?: string;
}

export const useDriverDeleteStore = defineStore("driverDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Driver) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No driver found. Please reload");
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

    setDeleted(deleted: Driver) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Driver | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
