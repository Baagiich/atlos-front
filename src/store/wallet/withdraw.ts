import { defineStore } from "pinia";
import type { SubmissionErrors } from "@/types/error";
import { WalletWithdraw } from "@/types/wallet/wallet-withdraw";
import api from "@/utils/api";
import { SubmissionError } from "@/utils/error";

interface State {
  created?: WalletWithdraw;
  isShowDialog: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useWalletWithdrawStore = defineStore("walletWithdraw", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    isSuccess: false,
    error: undefined,
    violations: undefined,
    isShowDialog: false,
  }),

  actions: {
    async withdraw(payload: WalletWithdraw) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("wallets/withdraw", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: WalletWithdraw = await response.json();

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

    setCreated(created: WalletWithdraw) {
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

    setIsShowDialog(value: boolean) {
      this.isShowDialog = value;
    },

    setIsSuccess(value: boolean) {
      this.isSuccess = value;
    },
  },
});
