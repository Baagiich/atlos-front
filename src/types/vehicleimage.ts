import type { Item } from "./item";
import { ListParams } from "./list";

export interface VehicleImage extends Item {
  image?: any;
  vehicle?: any;
  tag?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface VehicleImageListParams extends ListParams {
  vehicle?: string;
}
