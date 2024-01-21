import { defineStore } from "pinia";
import api from "@/utils/api";
import type { NotificationOrder } from "@/types/notificationorder";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";

interface State {
  items: NotificationOrder[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useNotificationOrderListStore = defineStore(
  "notificationOrderList",
  {
    state: (): State => ({
      items: [],
      totalItems: 0,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async getItems(params: ListParams) {
        this.setError("");
        this.toggleLoading();

        try {
          const response = await api("notification_orders", { params });
          const data: PagedCollection<NotificationOrder> =
            await response.json();

          this.toggleLoading();
          this.setItems(data["hydra:member"]);
          this.setTotalItems(data["hydra:totalItems"] ?? 0);
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

      setItems(items: NotificationOrder[]) {
        this.items = items;
      },

      setTotalItems(totalItems: number) {
        this.totalItems = totalItems;
      },

      setError(error: string) {
        this.error = error;
      },

      updateItem(updatedItem: NotificationOrder) {
        const item: NotificationOrder | undefined = this.items.find(
          (i) => i["@id"] === updatedItem["@id"],
        );

        if (!item) return;

        Object.assign(item, updatedItem);
      },
    },
  },
);
