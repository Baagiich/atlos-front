import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { ShipmentLoad } from "@/types/shipmentload";
import type { SubmissionErrors } from "@/types/error";

interface State {
  updated?: ShipmentLoad;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useShipmentLoadUpdateStore = defineStore("shipmentloadUpdate", {
  state: (): State => ({
    updated: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async update(payload: ShipmentLoad) {
      this.setError(undefined);
      this.toggleLoading();
      try {
        const response = await api(payload["@id"] ?? "", {
          method: "PUT",
          headers: new Headers({ "Content-Type": "application/ld+json" }),
          body: JSON.stringify(payload),
        });
        const data: ShipmentLoad = await response.json();

        this.toggleLoading();
        this.setUpdated(data);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof SubmissionError) {
          this.setViolations(error.errors);
          this.setError(error.errors._error);
          return;
        }

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    setUpdated(updated: ShipmentLoad) {
      this.updated = updated;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error?: string) {
      this.error = error;
    },

    setViolations(violations?: SubmissionErrors) {
      this.violations = violations;
    },

    resetErrors() {
      this.setError(undefined);
      this.setViolations(undefined);
    },
  },
});
