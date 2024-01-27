import { AdminUser } from "./adminuser";
import { Item } from "./item";
import { Shipment } from "./shipment";

export interface Review extends Item {
  rating?: number;
  content?: string;
  sender?: string | AdminUser;
  recipient?: string | AdminUser;
  shipment?: string | Shipment;
  tags?: string[];
  createdAt?: string;
}
