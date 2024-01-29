import { DeviceLocation } from "./devicelocation";
import { DocumentType } from "./documenttype";
import type { Item } from "./item";

export interface ShipmentDetail extends Item {
  deviceLocation?: [DeviceLocation];
  state?: string;
  driver?: any;
  action?: string;
  shipmentCode?: number;
  shipper?: any;
  vehicle?: any;
  fromAddress?: any;
  toAddress?: any;
  createdAt?: string;
  documentTypes?: DocumentType[];
}
