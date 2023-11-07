import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { Auth, TokenResponse } from "@/types/auth";
import type { SubmissionErrors } from "@/types/error";
import * as dayjs from "dayjs";
import { ENTRYPOINT } from "@/utils/config";

interface State {
  token?: TokenResponse;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

const TOKEN_KEY = "token";

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
          auth: false,
        });

        const data: TokenResponse = await response.json();

        this.setToken(data);
        this.toggleLoading();
      } catch (error) {
        this.toggleLoading();
        this.setToken(undefined);

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
    async refresh() {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("token/refresh", {
          method: "POST",
          body: JSON.stringify({
            refreshToken: this.getToken()?.refreshToken,
          }),
          auth: false,
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

    setToken(token: TokenResponse | undefined) {
      this.token = token;

      if (typeof token === "undefined") {
        localStorage.removeItem(TOKEN_KEY);
      } else {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      }
    },
    getToken(): TokenResponse | null {
      try {
        return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
      }

      return null;
    },
    isRefreshTokenAlive(): boolean {
      const token = this.getToken();
      const now = dayjs();

      return (
        (token && now.isBefore(dayjs(token.refreshTokenExpiration))) || false
      );
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
