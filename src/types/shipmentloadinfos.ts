import type { Item } from "./item";

export interface shipmentloadinfos extends Item {
  name?: string;
  quantity?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  shipment?: any;
  isPileUp?: boolean;
  packageType?: any;
}
