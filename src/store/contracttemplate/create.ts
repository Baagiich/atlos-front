import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { ContractTemplate } from "@/types/contracttemplate";
import type { SubmissionErrors } from "@/types/error";

interface State {
  created?: ContractTemplate;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useContractTemplateCreateStore = defineStore(
  "contracttemplateCreate",
  {
    state: (): State => ({
      created: undefined,
      isLoading: false,
      error: undefined,
      violations: undefined,
    }),

    actions: {
      async create(payload: ContractTemplate) {
        this.setError(undefined);
        this.setViolations(undefined);
        this.toggleLoading();

        try {
          const response = await api("contract_templates", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          const data: ContractTemplate = await response.json();

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

      setCreated(created: ContractTemplate) {
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
    },
  },
);
