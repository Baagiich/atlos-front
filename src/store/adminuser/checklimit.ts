import { defineStore } from "pinia";
import api from "@/utils/api";
import { AdminUserShipmentLimit } from "@/types/adminusershipmentlimit";

interface State {
  retrieved?: AdminUserShipmentLimit;
  isLoading: boolean;
  error?: string;
}

export const useAdminUserShipmentLimitStore = defineStore(
  "adminUserShipmentLimitStore",
  {
    state: (): State => ({
      retrieved: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async getShipmentLimit() {
        this.toggleLoading();

        try {
          const response = await api("admin_users/shipment/limit");
          const data: AdminUserShipmentLimit = await response.json();

          this.toggleLoading();

          if (data.isLimitExceed) {
            this.setError(data.message ?? "");
          }

          this.setRetrieved(data);
        } catch (error) {
          this.toggleLoading();

          if (error instanceof Error) {
            this.setError(error.message);
          }
        }
      },

      toggleLoading() {
        this.isLoading = !this.isLoading;
      },

      setRetrieved(retrieved: AdminUserShipmentLimit) {
        this.retrieved = retrieved;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  },
);
