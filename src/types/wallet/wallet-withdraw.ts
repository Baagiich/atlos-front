import { Item } from "../item";

export interface WalletWithdraw extends Item {
  toAccount?: number;
  amount?: number;
  currency?: string;
  toBank?: string;
  toAccountName?: string;
  success?: boolean;
}
