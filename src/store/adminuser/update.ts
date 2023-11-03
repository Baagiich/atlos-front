import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { AdminUser } from "@/types/adminuser";
import type { SubmissionErrors } from "@/types/error";

interface State {
  retrieved?: AdminUser;
  updated?: AdminUser;
  hubUrl?: URL;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useAdminUserUpdateStore = defineStore("adminuserUpdate", {
  state: (): State => ({
    retrieved: undefined,
    updated: undefined,
    hubUrl: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async retrieve(id: string) {
      this.toggleLoading();

      try {
        const response = await api(id);
        const data: AdminUser = await response.json();
        const hubUrl = extractHubURL(response);

        this.toggleLoading();
        this.setRetrieved(data);

        if (hubUrl) {
          this.setHubUrl(hubUrl);
        }
      } catch (error) {
        this.toggleLoading();

        if (error instanceof Error) {
          this.setError(error.message);
        }
      }
    },

    async update(payload: AdminUser) {
      this.setError(undefined);
      this.toggleLoading();

      if (!this.retrieved) {
        this.setError("No adminuser found. Please reload");
        return;
      }

      try {
        const response = await api(
          this.retrieved["@id"] ?? payload["@id"] ?? "",
          {
            method: "PUT",
            headers: new Headers({ "Content-Type": "application/ld+json" }),
            body: JSON.stringify(payload),
          }
        );
        const data: AdminUser = await response.json();

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

    setRetrieved(retrieved: AdminUser) {
      this.retrieved = retrieved;
    },

    setUpdated(updated: AdminUser) {
      this.updated = updated;
    },

    setHubUrl(hubUrl: URL) {
      this.hubUrl = hubUrl;
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
