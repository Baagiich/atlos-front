import type { Item } from "./item";

export interface AdminUser extends Item {
  firstName?: string;
  lastName?: string;
  userType?: string;
  roles?: string;
  email?: string;
  phoneNumber?: string;
  plainPassword?: string;
  status?: string;
  verified?: boolean;
  driver?: any;
}
