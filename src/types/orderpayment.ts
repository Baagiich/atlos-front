import type { Item } from "./item";

export interface OrderPayment extends Item {
  orderIri: string;
  method: string;
}
