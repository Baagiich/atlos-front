import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { ShipmentPriceBiddingPatch } from "@/types/shipmentpricebiddingpatch";
import type { SubmissionErrors } from "@/types/error";
import { log } from "node:console";
import { getegid } from "node:process";

interface State {
  created?: ShipmentPriceBiddingPatch;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useShipmentPriceBiddingPathcStore = defineStore(
  "ShipmentPriceBiddingPatchStore",
  {
    state: (): State => ({
      created: undefined,
      isLoading: false,
      error: undefined,
      violations: undefined,
    }),

    actions: {
      async create(payload: ShipmentPriceBiddingPatch) {
        this.setError(undefined);
        this.setViolations(undefined);
        this.toggleLoading();
        try {
          const response = await api(`shipment_price_biddings/${payload.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
            headers: new Headers({
              "Content-Type": "application/merge-patch+json",
            }),
          });
          const data: ShipmentPriceBiddingPatch = await response.json();

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

      setCreated(created: ShipmentPriceBiddingPatch) {
        this.created = created;
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
  }
);
