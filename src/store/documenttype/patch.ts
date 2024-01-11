import { defineStore } from "pinia";
import { SubmissionError } from "@/utils/error";
import api from "@/utils/api";
import type { DocumentType } from "@/types/documenttype";
import type { SubmissionErrors } from "@/types/error";

interface State {
  created?: DocumentType;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useDocumentTypePatchStore = defineStore(
  "DocumentTypePatchStore",
  {
    state: (): State => ({
      created: undefined,
      isLoading: false,
      error: undefined,
      violations: undefined,
    }),

    actions: {
      async create(payload: DocumentType) {
        this.setError(undefined);
        this.setViolations(undefined);
        this.toggleLoading();
        try {
          const response = await api(`document_types/${payload.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
            headers: new Headers({
              "Content-Type": "application/merge-patch+json",
            }),
          });
          const data: DocumentType = await response.json();

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

      setCreated(created: DocumentType) {
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
