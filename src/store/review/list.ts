import { defineStore } from "pinia";
import api from "@/utils/api";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";
import { Review } from "@/types/review";

interface State {
  items: Review[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useReviewList = defineStore("reviewList", {
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
        const response = await api("reviews", { params });
        const data: PagedCollection<Review> = await response.json();

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

    setItems(items: Review[]) {
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
