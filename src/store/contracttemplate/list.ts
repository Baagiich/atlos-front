import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { ContractTemplate } from "@/types/contracttemplate";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";
import { UserType } from "@/types/usertype";

interface State {
  items: ContractTemplate[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
  registrationTemplate?: ContractTemplate,
}

export const useContractTemplateListStore = defineStore(
  "contracttemplateList",
  {
    state: (): State => ({
      items: [],
      registrationTemplate: undefined,
      totalItems: 0,
      isLoading: false,
      error: undefined,
      hubUrl: undefined,
    }),

    actions: {
      async getItems(params: ListParams) {
        this.setError("");
        this.toggleLoading();

        try {
          const response = await api("contract_templates", { params });
          const data: PagedCollection<ContractTemplate> = await response.json();
          const hubUrl = extractHubURL(response);

          this.toggleLoading();

          this.setItems(data["hydra:member"]);
          this.setTotalItems(data["hydra:totalItems"] ?? 0);

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
      async getRegistrationTemplate() {

        const params = {
          page: "1",
          userType: `${UserType.SHIPPER}`,
          name: 'shipper_company_registration_term',
          groups:['read'] 
        };
        this.setError("");
        this.toggleLoading();
        try {
          const response = await api("contract_templates", { params , auth: false,});
          const data: PagedCollection<ContractTemplate> = await response.json();
          const hubUrl = extractHubURL(response);

          this.toggleLoading();

          this.setRegistrationTemplate(data["hydra:member"][0]);

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
      toggleLoading() {
        this.isLoading = !this.isLoading;
      },

      setItems(items: ContractTemplate[]) {
        this.items = items;
      },

      setTotalItems(totalItems: number) {
        this.totalItems = totalItems;
      },

      setHubUrl(hubUrl: URL) {
        this.hubUrl = hubUrl;
      },

      setError(error: string) {
        this.error = error;
      },
      setRegistrationTemplate(registrationTemplate: ContractTemplate) {
        this.registrationTemplate = registrationTemplate;
      },

      updateItem(updatedItem: ContractTemplate) {
        const item: ContractTemplate | undefined = this.items.find(
          (i) => i["@id"] === updatedItem["@id"]
        );

        if (!item) return;

        Object.assign(item, updatedItem);
      },

      deleteItem(deletedItem: ContractTemplate) {
        this.items = this.items.filter((item) => {
          return item["@id"] !== deletedItem["@id"];
        });
      },
    },
  }
);
