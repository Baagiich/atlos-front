import { defineStore } from "pinia";
import api from "@/utils/api";
import type { ContractTemplate } from "@/types/contracttemplate";

interface State {
  deleted?: ContractTemplate;
  mercureDeleted?: ContractTemplate;
  isLoading: boolean;
  error?: string;
}

export const useContractTemplateDeleteStore = defineStore(
  "contracttemplateDelete",
  {
    state: (): State => ({
      deleted: undefined,
      mercureDeleted: undefined,
      isLoading: false,
      error: undefined,
    }),

    actions: {
      async deleteItem(item: ContractTemplate) {
        this.setError("");
        this.toggleLoading();

        if (!item?.["@id"]) {
          this.setError("No contracttemplate found. Please reload");
          return;
        }

        try {
          await api(item["@id"], { method: "DELETE" });

          this.toggleLoading();
          this.setDeleted(item);
          this.setMercureDeleted(undefined);
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

      setDeleted(deleted: ContractTemplate) {
        this.deleted = deleted;
      },

      setMercureDeleted(mercureDeleted: ContractTemplate | undefined) {
        this.mercureDeleted = mercureDeleted;
      },

      setError(error: string) {
        this.error = error;
      },
    },
  },
);
