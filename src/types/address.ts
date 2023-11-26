import type { Item } from "./item";

export interface Address extends Item {
  street?: string;
  city?: any;
}
