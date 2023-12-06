import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import type { PasswordReset, PasswordResetVerify } from "@/types/passwordReset";
import type { SubmissionErrors } from "@/types/error";
import api from "@/utils/api";
import { SimpleResponse } from "@/types/simpleResponse";

interface State {
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
  data?: SimpleResponse;
}

export const useSecurityPasswordResetStore = defineStore("passwordReset", {
  state: (): State => ({
    isLoading: false,
    error: undefined,
    violations: undefined,
    data: undefined
  }),

  actions: {
    async passwordReset(payload: PasswordReset) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();
      this.setData(undefined);

      try {
        const response = await api("admin_users/password_reset", {
          auth: false,
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: SimpleResponse = await response.json();
        this.setData(data);
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
    async passwordResetVerify(payload: PasswordResetVerify) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();
      this.setData(undefined);

      try {
        const response = await api("admin_users/password_reset/verify", {
          auth: false,
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data: SimpleResponse = await response.json();
        this.setData(data);
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
    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
    setData(data: SimpleResponse | undefined) {
      this.data = data;
    },
  },
});
