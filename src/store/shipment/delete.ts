import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Shipment } from "@/types/shipment";

interface State {
  deleted?: Shipment;
  mercureDeleted?: Shipment;
  isLoading: boolean;
  error?: string;
}

export const useShipmentDeleteStore = defineStore("shipmentDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Shipment) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No shipment found. Please reload");
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

    setDeleted(deleted: Shipment) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Shipment | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
