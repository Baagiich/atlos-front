import type { Item } from "./item";

export interface OrderPayment extends Item {
  order?: string;
  gatewayName: string;
}
