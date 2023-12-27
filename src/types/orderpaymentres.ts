import type { Item } from "./item";

export interface OrderPaymentRes extends Item {
  gatewayName: string;
  number: string;
  status: number;
  details: any;
}
