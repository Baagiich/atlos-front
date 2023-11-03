import type { Item } from "./item";

export interface ContractTemplate extends Item {
  name?: string;
  template?: string;
  userType?: string;
  contracts?: any;
  updatedAt?: string;
  activeFrom?: string;
  activeTo?: string;
  createdAt?: string;
  active?: boolean;
}
