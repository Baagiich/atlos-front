import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { NotificationOrder } from "@/types/notificationorder";
import type { SubmissionErrors } from "@/types/error";

interface State {
  updated?: NotificationOrder;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useNotificationOrderSendStore = defineStore(
  "notificationOrderSend",
  {
    state: (): State => ({
      updated: undefined,
      isLoading: false,
      error: undefined,
      violations: undefined,
    }),

    actions: {
      async send(id: string) {
        this.setError(undefined);
        this.toggleLoading();

        try {
          const response = await api(`notification_orders/${id}/send`, {
            method: "POST",
            body: JSON.stringify({}),
          });
          const data: NotificationOrder = await response.json();

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

      setUpdated(updated: NotificationOrder) {
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
  },
);
