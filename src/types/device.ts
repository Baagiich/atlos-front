import type { Item } from "./item";

export interface Device extends Item {
  name: string;
  deviceId: string;
  model: string;
  version: string;
  os: string;
}
