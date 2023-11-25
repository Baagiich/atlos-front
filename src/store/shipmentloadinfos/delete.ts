import { defineStore } from "pinia";
import api from "@/utils/api";
import type { ShipmentLoadInfos } from "@/types/shipmentloadinfos";

interface State {
  deleted?: ShipmentLoadInfos;
  mercureDeleted?: ShipmentLoadInfos;
  isLoading: boolean;
  error?: string;
}

export const useShipmentLoadInfosDeleteStore = defineStore(
  "shipmentloadinfosDelete",
  {
    state: (): State => ({
      deleted: undefined,
      mercureDeleted: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async deleteItem(item: ShipmentLoadInfos) {
        this.setError("");
        this.toggleLoading();

        if (!item?.["@id"]) {
          this.setError("No shipmentloadinfos found. Please reload");
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

      setDeleted(deleted: ShipmentLoadInfos) {
        this.deleted = deleted;
      },

      setMercureDeleted(mercureDeleted: ShipmentLoadInfos | undefined) {
        this.mercureDeleted = mercureDeleted;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  },
);
