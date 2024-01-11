import { defineStore } from "pinia";
import type { DocumentType } from "@/types/documenttype";

interface State {
  items?: DocumentType[];
}

export const useCreateNewDocumentStore = defineStore("newDocumentItem", {
  state: (): State => ({
    items: [],
  }),

  actions: {
    async getItems() {
      return this.items;
    },

    setItems(items: DocumentType[]) {
      this.items = items;
    },
  },
});
