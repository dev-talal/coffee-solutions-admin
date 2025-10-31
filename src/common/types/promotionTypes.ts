import type { ProductImage, Product } from '@/common/types/productTypes';

export interface PromotionImage {
  id: number;
  product_id: string;
  image: string;
  created_at: string;
}

export interface PromotionProduct {
  id: number;
  promotion_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Promotion {
  id: number;
  name: string;
  ar_name: string;
  code: string;
  description?: string;
  ar_description?: string;
  quantity: string;
  price: string;
  status: string;
  promotion_end_date: string;
  images: ProductImage[];
  prmotion_products: PromotionProduct[];
  product_category_id: string;
}

export interface PromotionRequestPayload {
  name: string;
  ar_name: string;
  code: string;
  description?: string;
  ar_description?: string;
  quantity: number;
  product_category_id: string;
  price: number;
  status: '0' | '1';
  promotion_end_date?: string;
  images: string[];
  promotion_products: Array<{ product_id: string; quantity: number }>;
}
