import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Driver } from "@/types/driver";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";

interface State {
  items: Driver[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export const useDriverListStore = defineStore("driverList", {
  state: (): State => ({
    items: [],
    totalItems: 0,
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
  }),

  actions: {
    async getItems(params: ListParams) {
      this.setError("");
      this.toggleLoading();

      try {
        const response = await api("drivers", { params });
        const data: PagedCollection<Driver> = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();

        this.setItems(data["hydra:member"]);
        this.setTotalItems(data["hydra:totalItems"] ?? 0);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
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

    setItems(items: Driver[]) {
      this.items = items;
    },

    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },

    updateItem(updatedItem: Driver) {
      const item: Driver | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"],
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Driver) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
