import { defineStore } from "pinia";
import api from "@/utils/api";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";
import { Order } from "@/types/order";

interface State {
  items: Order[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useOrderListStore = defineStore("orderList", {
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
        const response = await api("orders", { params });
        const data: PagedCollection<Order> = await response.json();

        this.toggleLoading();

        const members = data["hydra:member"];
        for (const member of members) {
          if (member["items"].length > 0) {
            member.item = member["items"][0];
          }
        }

        this.setItems(members);
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

    setItems(items: Order[]) {
      this.items = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
