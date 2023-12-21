import type { Item } from "./item";

export interface ShipmentPriceBiddingPatch extends Item {
  id?: string;
  state?: string;
}
