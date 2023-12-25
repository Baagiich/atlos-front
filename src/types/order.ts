import type { Item } from "./item";
import { Money } from "./money";
import { OrderItem } from "./orderitem";

export interface Order extends Item {
  number: string;
  items: OrderItem[];
  item: OrderItem;
  status: string;
  totalAmount: Money;
  paidAt?: string;
}
