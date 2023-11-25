import type { Item } from "./item";

export interface Driver extends Item {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  registerNumber?: string;
  adminUser?: string;
}
