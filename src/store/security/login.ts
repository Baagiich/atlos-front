import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { AdminUser } from "@/types/adminuser";
import type { Auth, TokenResponse } from "@/types/auth";
import type { SubmissionErrors } from "@/types/error";

interface State {
  token?: TokenResponse;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useSecurityLoginStore = defineStore("securityLogin", {
  state: (): State => ({
    token: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async login(payload: Auth) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("auth", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const data: TokenResponse = await response.json();

        this.setToken(data);
        this.toggleLoading();
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

    setToken(token: TokenResponse) {
      this.token = token;
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
