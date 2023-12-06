import { defineStore } from "pinia";
import api from "@/utils/api";
import { extractHubURL } from "@/utils/mercure";
import type { Vehicle } from "@/types/vehicle";
import type { PagedCollection } from "@/types/collection";
import type { ListParams } from "@/types/list";
import { VehicleType } from "@/types/vehicletype";
import { VehicleCapacityType } from "@/types/vehiclecapacitytype";

interface State {
  items: Vehicle[];
  totalItems: number;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export const useVehicleListStore = defineStore("vehicleList", {
  state: (): State => ({
    items: [],
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
        const response = await api("vehicles", { params });
        const data: PagedCollection<Vehicle> = await response.json();
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

    toggleLoading() {
      this.isLoading = !this.isLoading;
    },

    setItems(items: Vehicle[]) {
      items.map((item) => {
        item.shipper = item.shipper ? item.shipper.firstName + " " + item.shipper.lastName : {};
        item.vehicleType = item.vehicleType ? VehicleType[item.vehicleType] : {};
        item.vehicleCapacity = item.vehicleCapacity ? VehicleCapacityType[item.vehicleCapacity] : {};
      });
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

    updateItem(updatedItem: Vehicle) {
      const item: Vehicle | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Vehicle) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
