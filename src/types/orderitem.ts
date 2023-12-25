import type { Item } from "./item";
import { Money } from "./money";
import { Product } from "./product";
import { Shipment } from "./shipment";

export interface OrderItem extends Item {
  quantity: number;
  order: any;
  product: Product;
  details?: any;
  shipment: Shipment;
  amount: Money;
}
