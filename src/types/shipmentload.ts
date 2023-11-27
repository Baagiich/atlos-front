import type { Item } from "./item";

export interface ShipmentLoad extends Item {
  name?: string;
  quantity?: number;
  length?: decimal;
  width?: decimal;
  height?: decimal;
  weight?: decimal;
  shipment?: any;
  packageType?: any;
}
