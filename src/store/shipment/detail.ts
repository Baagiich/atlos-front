import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import { ShipmentDetail } from "@/types/shipmentdetail";

interface State {
  retrieved?: ShipmentDetail;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
  totalItems: number;
}

export const useShipmentDetailStore = defineStore("shipmentDetail", {
  state: (): State => ({
    retrieved: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
    totalItems: 0,
  }),

  actions: {
    async retrieve(id: string) {
      this.toggleLoading();

      try {
        const params = new URLSearchParams({ "groups[]": "shipment:detail" });
        const url = `${id}?${params.toString()}`;
        const response = await api(url);
        const data: ShipmentDetail = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();
        this.setRetrieved(data);
        this.setTotalItems(data.deviceLocation?.length ?? 0);

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

    setRetrieved(retrieved: ShipmentDetail) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error: string) {
      this.error = error;
    },
    setTotalItems(totalItems: number) {
      this.totalItems = totalItems;
    },
  },
});
