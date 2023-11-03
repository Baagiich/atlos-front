import type { Item } from "./item";

export interface City extends Item {
  name?: string;
  state?: any;
  capital?: boolean;
  addresses?: any;
  updatedAt?: string;
  createdAt?: string;
}
