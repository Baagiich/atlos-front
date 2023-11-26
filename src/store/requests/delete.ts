import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Requests } from "@/types/requests";

interface State {
  deleted?: Requests;
  mercureDeleted?: Requests;
  isLoading: boolean;
  error?: string;
}

export const useRequestsDeleteStore = defineStore("requestsDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: Requests) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No requests found. Please reload");
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

    setDeleted(deleted: Requests) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Requests | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
