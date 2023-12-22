import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { OrderPayment } from "@/types/orderpayment";
import type { SubmissionErrors } from "@/types/error";

interface State {
  created?: OrderPayment;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useOrderPaymentStore = defineStore("orderPayment", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async payOrder(payload: OrderPayment) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("payments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: OrderPayment = await response.json();

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

    setCreated(created: OrderPayment) {
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
});
