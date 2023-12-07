import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";

import type { SubmissionErrors } from "@/types/error";
import { AdminUser } from "@/types/adminuser";
import { Consignor } from "@/types/consignor";

interface State {
  created?: Consignor;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useConsignorRegisterStore = defineStore("consignorRegister", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: Consignor) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("consignors/registration", {
          auth: false,
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: Consignor = await response.json();

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

    setCreated(created: Consignor) {
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
