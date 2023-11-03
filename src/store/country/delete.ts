import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Country } from "@/types/country";

interface State {
  deleted?: Country;
  mercureDeleted?: Country;
  isLoading: boolean;
  error?: string;
}

export const useCountryDeleteStore = defineStore("countryDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Country) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No country found. Please reload");
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

    setDeleted(deleted: Country) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Country | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
