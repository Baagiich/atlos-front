import { defineStore } from "pinia";
import api from "@/utils/api";
import type { VehicleImage } from "@/types/vehicleimage";

interface State {
  deleted?: VehicleImage;
  mercureDeleted?: VehicleImage;
  isLoading: boolean;
  error?: string;
}

export const useVehicleImageDeleteStore = defineStore("vehicleimageDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: VehicleImage) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No vehicleimage found. Please reload");
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

    setDeleted(deleted: VehicleImage) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: VehicleImage | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
