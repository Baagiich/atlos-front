import type { Item } from "./item";

export interface Country extends Item {
  isoCode3?: string;
  name?: string;
  states?: any;
  updatedAt?: string;
  createdAt?: string;
}
