import type { Item } from "./item";
import { ListParams } from "./list";

export interface ShipmentImage extends Item {
  image?: any;
  shipment?: any;
  tags?: string;
  status?: string;
  rejectedCauses?: string;
  approvedAt?: string;
  rejectedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface ShipmentImageListParams extends ListParams {
  shipment?: string;
}
