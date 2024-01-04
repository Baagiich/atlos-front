import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import { ShipmentImage } from "@/types/shipmentimage";

interface State {
  retrieved?: ShipmentImage;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
}

export const useShipmentImageShowStore = defineStore("shipmentImageShow", {
  state: (): State => ({
    retrieved: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    async retrieve(id: string) {
      this.toggleLoading();

      try {
        const params = new URLSearchParams({ "groups[]": "shipment:list" });
        const url = `${id}?${params.toString()}`;
        const response = await api(url);
        const data: ShipmentImage = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();
        this.setRetrieved(data);

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

    setRetrieved(retrieved: ShipmentImage) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
