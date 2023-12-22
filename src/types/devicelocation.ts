import type { Item } from "./item";

export interface DeviceLocation extends Item {
  location?: any;
  coordinate?: any;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
}
