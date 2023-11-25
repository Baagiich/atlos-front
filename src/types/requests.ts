import type { Item } from "./item";

export interface Requests extends Item {
  fromUser?: any;
  toUser?: any;
  code?: string;
  type?: string;
  targetEntityId?: number;
  params?: string;
  updatedAt?: string;
  createdAt?: string;
}
