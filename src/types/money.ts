import type { Item } from "./item";

export interface Money extends Item {
  amount: number;
  currency: string;
}
