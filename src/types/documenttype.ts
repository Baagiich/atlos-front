import type { Item } from "./item";

export interface DocumentType extends Item {
  id?: string;
  shipment?: string;
  name?: string;
  quantity?: number;
}
