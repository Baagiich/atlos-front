import type { Item } from "./item";

export interface ShipmentPriceBidding extends Item {
  shipment?: any;
  shipmentDeal?: any;
  price: {
    amount?: number;
    currency?: string;
  };
}
