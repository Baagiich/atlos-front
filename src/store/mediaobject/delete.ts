import { defineStore } from "pinia";
import api from "@/utils/api";
import type { MediaObject } from "@/types/mediaobject";

interface State {
  deleted?: MediaObject;
  mercureDeleted?: MediaObject;
  isLoading: boolean;
  error?: string;
}

export const useMediaObjectDeleteStore = defineStore("mediaobjectDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: MediaObject) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No mediaobject found. Please reload");
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

    setDeleted(deleted: MediaObject) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: MediaObject | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
