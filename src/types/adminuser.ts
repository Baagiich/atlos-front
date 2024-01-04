import type { Item } from "./item";

export interface AdminUser extends Item {
  firstName?: string;
  lastName?: string;
  userType?: number;
  roles?: string;
  email?: string;
  phoneNumber?: string;
  plainPassword?: string;
  status?: number;
  verified?: boolean;
  driver?: any;
}
