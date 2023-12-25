import { defineStore } from "pinia";
import api from "@/utils/api";
import { Order } from "@/types/order";
import { ListParams } from "@/types/list";
import { PagedCollection } from "@/types/collection";

interface State {
  retrieved?: Order;
  isLoading: boolean;
  error?: string;
}

export const useOrderShowStore = defineStore("orderShow", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async retrieve(params: ListParams) {
      this.toggleLoading();

      try {
        const response = await api("orders", { params });
        const data: PagedCollection<Order> = await response.json();

        this.toggleLoading();

        if (
          data["hydra:member"][0] &&
          data["hydra:member"][0]["items"].length > 0
        ) {
          data["hydra:member"][0].item = data["hydra:member"][0]["items"][0];
        }

        this.setRetrieved(data["hydra:member"][0]);
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

    setRetrieved(retrieved: Order) {
      this.retrieved = retrieved;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
