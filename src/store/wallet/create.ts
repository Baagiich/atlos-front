import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { SubmissionErrors } from "@/types/error";
import { WalletCreate } from "@/types/wallet/wallet-create";

interface State {
  isSuccess: boolean;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useWalletCreateStore = defineStore("walletCreate", {
  state: (): State => ({
    isSuccess: false,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: WalletCreate) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("wallets", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        this.toggleLoading();
        this.setSuccess(data ? data.success : false);
        this.setError(data.success ? undefined : data.message);
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

    setSuccess(isSuccess: boolean) {
      this.isSuccess = isSuccess;
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
