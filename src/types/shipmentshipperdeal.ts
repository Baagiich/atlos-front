import type { Item } from "./item";

export interface ShipmentShipperDeal extends Item {
  shipment?: any;
  shipper?: any;
  price: {
    amount?: number;
    currency?: string;
  };
  driver?: any;
  vehicle?: any;
}
