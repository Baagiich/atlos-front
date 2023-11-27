import { defineStore } from "pinia";
import api from "@/utils/api";
import type { DriverImage } from "@/types/driverimage";

interface State {
  deleted?: DriverImage;
  mercureDeleted?: DriverImage;
  isLoading: boolean;
  error?: string;
}

export const useDriverImageDeleteStore = defineStore("driverimageDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: DriverImage) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No driverimage found. Please reload");
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

    setDeleted(deleted: DriverImage) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: DriverImage | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
