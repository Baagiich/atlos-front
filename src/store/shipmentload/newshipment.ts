import { defineStore } from "pinia";
import type { Shipment } from "@/types/shipment";

interface State {
  item?: Shipment;
}

export const useCreateNewShipmentStore = defineStore("newShipmentItem", {
  state: (): State => ({
    item: {},
  }),

  actions: {
    async getItem() {
      return this.item;
    },

    setItems(item: Shipment) {
      this.item = item;
    },
  },
});
