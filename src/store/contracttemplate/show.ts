import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { ContractTemplate } from "@/types/contracttemplate";

interface State {
  retrieved?: ContractTemplate;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
}

export const useContractTemplateShowStore = defineStore(
  "contracttemplateShow",
  {
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
          const data: ContractTemplate = await response.json();
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

      setRetrieved(retrieved: ContractTemplate) {
        this.retrieved = retrieved;
      },

      setHubUrl(hubUrl: URL) {
        this.hubUrl = hubUrl;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  }
);
