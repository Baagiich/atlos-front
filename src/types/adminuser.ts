import type { Item } from "./item";
import { ReviewUser } from "./reviewuser";

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
  review?: ReviewUser;
}
