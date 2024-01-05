import { defineStore } from "pinia";
import api from "@/utils/api";
import type { PagedCollection } from "@/types/collection";
import { OrderItem } from "@/types/orderitem";

interface State {
  items: OrderItem[];
  firstItem?: OrderItem;
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useOrderItemListStore = defineStore("orderItemList", {
  state: (): State => ({
    items: [],
    firstItem: undefined,
    totalItems: 0,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async getItems(params: object) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("order_items", { params });
        const data: PagedCollection<OrderItem> = await response.json();

        this.toggleLoading();

        this.setFirstItem(
          data["hydra:totalItems"] && data["hydra:totalItems"] > 0
            ? data["hydra:member"][data["hydra:totalItems"] - 1]
            : undefined,
        );
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

    setItems(items: OrderItem[]) {
      this.items = items;
    },

    setFirstItem(item?: OrderItem) {
      this.firstItem = item;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
