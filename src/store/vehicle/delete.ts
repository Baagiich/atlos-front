import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Vehicle } from "@/types/vehicle";

interface State {
  deleted?: Vehicle;
  mercureDeleted?: Vehicle;
  isLoading: boolean;
  error?: string;
}

export const useVehicleDeleteStore = defineStore("vehicleDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Vehicle) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No vehicle found. Please reload");
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

    setDeleted(deleted: Vehicle) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Vehicle | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
