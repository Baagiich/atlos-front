import type { Item } from "./item";

export interface Contract extends Item {
  adminUser?: any;
  contractTemplate?: any;
  signed?: boolean;
  updatedAt?: string;
  createdAt?: string;
}
