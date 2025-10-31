import type { CustomerAddress, CustomerTransaction } from './customerTypes';
import type { Product } from './productTypes';

export interface OrderItem {
  id: number;
  price: string;
  quantity: number;
  product: Product;
  product_name: string;
  ar_product_name: string;
  product_image: string;
  product_unit_id: string;
  is_box: '0' | '1';
  uom_product_unit_id: number;
  unit: string;
  ar_unit: string;
  uom_unit: string;
  ar_uom_unit: string;
  product_pieces_per_box: string;
}
export interface Warehouse {
  id: number;
  name: string;
}

export interface Order extends CustomerAddress {
  id: number;
  order_id: string;
  driver_id?: string;
  driver: {
    id: number;
    first_name: string;
    last_name: string;
  };
  items: OrderItem[];
  payment_method: string;
  status: string;
  sub_total: number;
  tax_amount: number;
  total_amount: number;
  amount: number;
  user: CustomerTransaction;
  created_at: Date;
  warehouse: Warehouse;
}
