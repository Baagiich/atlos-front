import { defineStore } from "pinia";
import api from "@/utils/api";
import type { ShipperCompany } from "@/types/shippercompany";

interface State {
  deleted?: ShipperCompany;
  mercureDeleted?: ShipperCompany;
  isLoading: boolean;
  error?: string;
}

export const useShipperCompanyDeleteStore = defineStore(
  "shippercompanyDelete",
  {
    state: (): State => ({
      deleted: undefined,
      mercureDeleted: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async deleteItem(item: ShipperCompany) {
        this.setError("");
        this.toggleLoading();

        if (!item?.["@id"]) {
          this.setError("No shippercompany found. Please reload");
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

      setDeleted(deleted: ShipperCompany) {
        this.deleted = deleted;
      },

      setMercureDeleted(mercureDeleted: ShipperCompany | undefined) {
        this.mercureDeleted = mercureDeleted;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  }
);
