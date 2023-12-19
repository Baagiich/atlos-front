import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { Currency } from "@/types/currency";
import type { SubmissionErrors } from "@/types/error";

interface State {
  retrieved?: Currency;
  updated?: Currency;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useCurrencyUpdateStore = defineStore("currencyUpdate", {
  state: (): State => ({
    retrieved: undefined,
    updated: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async retrieve(id: string) {
      this.toggleLoading();

      try {
        const response = await api(id);
        const data: Currency = await response.json();

        this.toggleLoading();
        this.setRetrieved(data);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    async update(payload: Currency) {
      this.setError(undefined);
      this.toggleLoading();

      if (!this.retrieved) {
        this.setError("Not found. Please reload");
        return;
      }

      try {
        const response = await api(
          this.retrieved["@id"] ?? payload["@id"] ?? "",
          {
            method: "PATCH",
            headers: new Headers({
              "Content-Type": "application/merge-patch+json",
            }),
            body: JSON.stringify(payload),
          },
        );
        const data: Currency = await response.json();

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

    setRetrieved(retrieved: Currency) {
      this.retrieved = retrieved;
    },

    setUpdated(updated: Currency) {
      this.updated = updated;
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
