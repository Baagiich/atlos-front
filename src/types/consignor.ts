import type { Item } from "./item";

export interface Consignor extends Item {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  register?: string;
  certificate?: any;
  status?: string;
  adminUser?: string;
  adminEditable?: boolean;
}
