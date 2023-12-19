import { defineStore } from "pinia";
import type { SubmissionErrors } from "@/types/error";
import { WalletDepositAccountInfo } from "@/types/wallet/wallet-deposit-account-info";

interface State {
  isShowDialog: boolean;
  depositAccountInfos: WalletDepositAccountInfo[];
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useWalletDepositStore = defineStore("walletDeposit", {
  state: (): State => ({
    isLoading: false,
    error: undefined,
    violations: undefined,
    isShowDialog: false,
    depositAccountInfos: [
      {
        currency: "MNT",
        bankName: "Khanbank",
        bankAccountName: "Lodipay LLC",
        bankAccountNo: "5065254444",
      },
      {
        currency: "CNY",
        bankName: "Khanbank",
        bankAccountName: "Lodipay LLC",
        bankAccountNo: "5065254455",
      },
      {
        currency: "USD",
        bankName: "Khanbank",
        bankAccountName: "Lodipay LLC",
        bankAccountNo: "5065254466",
      },
      {
        currency: "RUB",
        bankName: "Khanbank",
        bankAccountName: "Lodipay LLC",
        bankAccountNo: "5065254477",
      },
    ],
  }),

  actions: {
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
  },
});
