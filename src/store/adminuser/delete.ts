import { defineStore } from "pinia";
import api from "@/utils/api";
import type { AdminUser } from "@/types/adminuser";

interface State {
  deleted?: AdminUser;
  mercureDeleted?: AdminUser;
  isLoading: boolean;
  error?: string;
}

export const useAdminUserDeleteStore = defineStore("adminuserDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async deleteItem(item: AdminUser) {
      this.setError("");
      this.toggleLoading();

      if (!item?.["@id"]) {
        this.setError("No adminuser found. Please reload");
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

    setDeleted(deleted: AdminUser) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: AdminUser | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
