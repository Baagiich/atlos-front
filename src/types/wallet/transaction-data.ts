export interface WalletTransactionData {
  id: number;
  wallet_no: string;
  transaction_id: string;
  transaction_reference: string;
  amount: string;
  description: string;
  status: string;
  currency: string;
  payment_method: string;
  is_inflow: number;
  created_at: Date;
  updated_at: Date;
}
