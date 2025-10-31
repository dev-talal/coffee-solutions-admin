import type { Category, ProductImage } from './productTypes';

export interface PopularProducts {
  id: number;
  name: string;
  ar_name: string;
  code: string;
  description: string;
  ar_description: string;
  quantity: string;
  product_category_id: string;
  price: string;
  final_price?: string;
  status: string;
  is_uom_small: string;
  pieces_per_box: string;
  images: ProductImage[];
  category: Category;
}
