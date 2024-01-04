import type { Item } from "./item";
import { ShipmentLoadPackageType } from "./shipmentloadpackagetype";

export interface ShipmentLoad extends Item {
  name?: string;
  quantity?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  shipment?: string;
  packageType?: string | ShipmentLoadPackageType;
  isPileUp: boolean;
}
