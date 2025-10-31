export interface ProductImage {
  id: number;
  product_id: string;
  image: string;
  created_at: string;
}

export interface CartProduct {
  id: number;
  name: string;
  ar_name: string;
  description: string;
  ar_description: string;
  final_price: number;
  old_price: string;
  discount_amount: number;
  discount_percent: string;
  is_uom_small: string;
  pieces_per_box: string;
  is_promotion: string;
  is_liked: boolean;
  product_unit: string | null;
  product_unit_id: string | null;
  uom_product_unit: string | null;
  uom_product_unit_id: string | null;
  images: ProductImage[];
  taxes: { name: string; rate: string }[];
}

export interface CustomerCartItem {
  id: number;
  product_id: string;
  session_id: string | null;
  user_id: string;
  quantity: string;
  is_box: string;
  product: CartProduct;
}

export interface CustomerCartResponse {
  data: CustomerCartItem[];
}
