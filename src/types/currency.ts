import type { Item } from "./item";

export interface Currency extends Item {
  name?: string;
  code?: string;
}
