import { defineStore } from "pinia";
import api from "@/utils/api";
import type { NotificationOrder } from "@/types/notificationorder";

interface State {
  retrieved?: NotificationOrder;
  isLoading: boolean;
  error?: string;
}

export const useNotificationOrderShowStore = defineStore(
  "notificationOrderShow",
  {
    state: (): State => ({
      retrieved: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async retrieve(id: string) {
        this.toggleLoading();

        try {
          const response = await api(id);
          const data: NotificationOrder = await response.json();

          this.toggleLoading();
          this.setRetrieved(data);
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

      setRetrieved(retrieved: NotificationOrder) {
        this.retrieved = retrieved;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  },
);
