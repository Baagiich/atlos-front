import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { Shipment } from "@/types/shipment";
import type { SubmissionErrors } from "@/types/error";

interface State {
  updated?: Shipment;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useShipmentPatchStore = defineStore("shipmentPatch", {
  state: (): State => ({
    updated: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async doAction(shipmentId: number, action: string) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api(`shipment/${shipmentId}/do-action`, {
          method: "PATCH",
          headers: new Headers({
            "Content-Type": "application/merge-patch+json",
          }),
          body: JSON.stringify({ action: action }),
        });
        const data: Shipment = await response.json();

        this.toggleLoading();
        this.setCreated(data);
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

    setCreated(created: Shipment) {
      this.updated = created;
    },

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
