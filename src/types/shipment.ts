import type { Item } from "./item";

export interface Shipment extends Item {
  shipmentImages?: any;
  state?: string;
  driver?: any;
  adminuser?: any;
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
  price?: {
    amount?: number;
    currency?: string;
  };
  updatedAt?: string;
  createdAt?: string;
  shipmentTypeCode?: string;
  name?: string;
  loadType?: any;
  currency?: string;
  mainWeight?: number;
  mainSize?: number;
}
