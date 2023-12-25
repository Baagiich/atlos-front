import type { Item } from "./item";
import { Money } from "./money";

export interface Product extends Item {
  name: string;
  description?: string;
  string?: Money;
}
