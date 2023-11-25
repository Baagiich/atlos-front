import type { Item } from "./item";

export interface ShipmentLoadInfos extends Item {
  name?: string;
  count?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  shipment?: any;
  isPileUp?: boolean;
  packageType?: any;
}
