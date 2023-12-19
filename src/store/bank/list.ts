import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Bank } from "@/types/bank";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";

interface State {
  items: Bank[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export const useBankListStore = defineStore("bankList", {
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
        const response = await api("banks", { params });
        const data: PagedCollection<Bank> = await response.json();

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

    setItems(items: Bank[]) {
      this.items = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: Bank) {
      const item: Bank | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"],
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },
  },
});
