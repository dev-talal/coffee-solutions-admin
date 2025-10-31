import type { PaginatedResponse } from './commonTypes';
import type { Customer } from './customerTypes';

export interface Transactions {
  id: number;
  user_id: string;
  order_id: string;
  type: string;
  method: string;
  amount: number;
  status: string;
  created_at: string;
  customer: Customer;
}

export interface TransactionResponse {
  data: {
    total_revenue: number;
    today_revenue: number;
    transactions: PaginatedResponse<Transactions>;
  };
}
