import type { Item } from "./item";

export interface Address extends Item {
  id?: string;
  street?: string;
  city?: any;
  zipCode?: string;
  contactPhoneNunmber?: string;
  contactName?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}
