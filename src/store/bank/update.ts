import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { Bank } from "@/types/bank";
import type { SubmissionErrors } from "@/types/error";

interface State {
  retrieved?: Bank;
  updated?: Bank;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useBankUpdateStore = defineStore("bankUpdate", {
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
        const data: Bank = await response.json();

        this.toggleLoading();
        this.setRetrieved(data);
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    async update(payload: Bank) {
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
        const data: Bank = await response.json();

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

    setRetrieved(retrieved: Bank) {
      this.retrieved = retrieved;
    },

    setUpdated(updated: Bank) {
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