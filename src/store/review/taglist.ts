import { defineStore } from "pinia";
import api from "@/utils/api";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";
import { ReviewTag } from "@/types/reviewtag";

interface State {
  items: ReviewTag[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useReviewTagList = defineStore("reviewTagList", {
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
        const response = await api("review_tags", { params });
        const data: PagedCollection<ReviewTag> = await response.json();

        this.toggleLoading();

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

    setItems(items: ReviewTag[]) {
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
