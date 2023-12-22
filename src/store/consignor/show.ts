import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Consignor } from "@/types/consignor";
import * as apiToken from "@/utils/apiToken";
import { UserType } from "@/types/usertype";

interface State {
  retrieved?: Consignor;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
}

export const useConsignorShowStore = defineStore("consignorShow", {
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
        const response = await api(id);
        const data: Consignor = await response.json();
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

    setRetrieved(retrieved: Consignor) {
      retrieved.adminEditable = true;
      if (apiToken.getDecodedToken().user_type !== UserType.ADMIN) {
        retrieved.adminEditable = false;
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
