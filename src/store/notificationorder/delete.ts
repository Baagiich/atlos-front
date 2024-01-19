import { defineStore } from "pinia";
import api from "@/utils/api";
import type { NotificationOrder } from "@/types/notificationorder";

interface State {
  deleted?: NotificationOrder;
  isLoading: boolean;
  error?: string;
}

export const useNotificationOrderDeleteStore = defineStore(
  "notificationOrderDelete",
  {
    state: (): State => ({
      deleted: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async deleteItem(item: NotificationOrder) {
        this.setError("");
        this.toggleLoading();

        if (!item?.["@id"]) {
          this.setError("No found. Please reload");
          return;
        }

        try {
          await api(item["@id"], { method: "DELETE" });

          this.toggleLoading();
          this.setDeleted(item);
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

      setDeleted(deleted: NotificationOrder) {
        this.deleted = deleted;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  },
);
