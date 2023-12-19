import type { Item } from "./item";

export interface Bank extends Item {
  name: string;
  nameEn: string;
  code: string;
}
