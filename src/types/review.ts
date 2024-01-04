import { AdminUser } from "./adminuser";
import { Item } from "./item";
import { Shipment } from "./shipment";

export interface Review extends Item {
  rating?: number;
  content?: string;
  adminUser?: string | AdminUser;
  shipment?: string | Shipment;
  tags?: string[];
}
