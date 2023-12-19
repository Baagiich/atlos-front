import { WalletTransactionData } from "./transaction-data";
import { WalletTransactionPagination } from "./transaction-pagination";

export interface WalletTransaction {
  data: WalletTransactionData;
  pagination: WalletTransactionPagination;
}
