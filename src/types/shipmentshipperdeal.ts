import type { Item } from "./item";
import { ShipmentPriceBidding } from "./shipmentpricebidding";

export interface ShipmentShipperDeal extends Item {
  shipment?: any;
  shipper?: any;
  price?: {
    amount?: number;
    currency?: string;
  };
  driver?: any;
  vehicle?: any;
  shipmentPriceBiddings?: string | ShipmentPriceBidding[];
  status?: number;
}
