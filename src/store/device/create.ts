import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { SubmissionErrors } from "@/types/error";
import { Device } from "@/types/device";

interface State {
  created?: Device;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useDeviceCreateStore = defineStore("deviceCreate", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    async create(payload: Device) {
      this.setError(undefined);
      this.setViolations(undefined);
      this.toggleLoading();

      try {
        const response = await api("devices", {
          method: "POST",
          body: JSON.stringify(payload),
          auth: false,
        });
        const data: Device = await response.json();

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

    setCreated(created: Device) {
      this.created = created;
      localStorage.setItem("device", JSON.stringify(created));
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
