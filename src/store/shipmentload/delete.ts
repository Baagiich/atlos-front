import { defineStore } from "pinia";
import api from "@/utils/api";
import type { ShipmentLoad } from "@/types/shipmentload";

interface State {
  deleted?: ShipmentLoad;
  mercureDeleted?: ShipmentLoad;
  isLoading: boolean;
  error?: string;
}

export const useShipmentLoadDeleteStore = defineStore("shipmentloadDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: ShipmentLoad) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No shipmentload found. Please reload");
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

    setDeleted(deleted: ShipmentLoad) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: ShipmentLoad | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
