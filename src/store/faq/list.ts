import { defineStore } from "pinia";
import api from "@/utils/api";
import type { PagedCollection } from "@/types/collection";
import { Faq } from "@/types/faq";

interface State {
  items: Faq[];
  isLoading: boolean;
  totalItems: number;
  error?: string;
}

export const useFaqItemListStore = defineStore("orderItemList", {
  state: (): State => ({
    items: [],
    isLoading: false,
    totalItems: 0,
    error: undefined,
  }),

  actions: {
    async getItems(params: object) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("faqs", { params });
        const data: PagedCollection<Faq> = await response.json();

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

    setItems(items: Faq[]) {
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
