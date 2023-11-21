import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Country } from "@/types/country";
import { Device } from "@/types/device";

interface State {
  retrieved?: Device;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
}

export const useDeviceShowStore = defineStore("deviceShow", {
  state: (): State => ({
    retrieved: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    retrieveFromLocal() {
      let item = undefined;
      try {
        item = JSON.parse(localStorage.getItem("device") ?? "null");
      } catch (e) {
        item = undefined;
      }
      this.setRetrieved(item);
    },
    async retrieve(id: string, options: any = {}) {
      this.toggleLoading();
      try {
        const response = await api(id);
        const data: Device = await response.json();
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

    setRetrieved(retrieved?: Device) {
      if (retrieved === undefined) {
        localStorage.removeItem("device");
      }
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
