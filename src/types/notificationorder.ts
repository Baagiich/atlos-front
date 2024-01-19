import type { Item } from "./item";

export interface NotificationOrder extends Item {
  id?: string;
  title?: string;
  description?: string;
  segment?: string;
  status?: string;
  sentAt?: Date;
  createdAt?: Date;
}
