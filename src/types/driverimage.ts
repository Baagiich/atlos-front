import type { Item } from "./item";
import { ListParams } from "./list";

export interface DriverImage extends Item {
  image?: any;
  driver?: any;
  tag?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface DriverImageListParams extends ListParams {
  driver?: string;
}
