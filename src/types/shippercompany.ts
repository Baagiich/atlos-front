import type { Item } from "./item";

export interface ShipperCompany extends Item {
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  register?: string;
  phoneNumber?: string;
}
