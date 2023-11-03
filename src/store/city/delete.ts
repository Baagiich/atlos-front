import { defineStore } from "pinia";
import api from "@/utils/api";
import type { City } from "@/types/city";

interface State {
  deleted?: City;
  mercureDeleted?: City;
  isLoading: boolean;
  error?: string;
}

export const useCityDeleteStore = defineStore("cityDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: City) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No city found. Please reload");
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

    setDeleted(deleted: City) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: City | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
