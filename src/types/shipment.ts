import type { Item } from "./item";

export interface Shipment extends Item {
  shipmentImages?: any;
  state?: string;
  driver?: any;
  action?: string;
  consignor?: string;
  shipmentCode?: string;
  shipmentType?: string;
  shipmentShipperDeals?: any;
  reviews?: any;
  shipper?: any;
  fromAddress?: any;
  toAddress?: any;
  loadAt?: string;
  unloadAt?: string;
  prePayment?: number;
  postPayment?: number;
  price?: string;
  updatedAt?: string;
  createdAt?: string;
  shipmentTypeCode?: string;
}
