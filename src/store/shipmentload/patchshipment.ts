import { defineStore } from "pinia";
import type { Shipment } from "@/types/shipment";

interface State {
  item: Shipment;
}

export const usepatchShipmentStore = defineStore("patchShipmentItem", {
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
