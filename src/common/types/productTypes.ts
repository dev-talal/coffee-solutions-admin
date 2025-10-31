export interface ProductImage {
  id: number;
  product_id: string;
  image: string;
  created_at: string;
}

export interface CustomerCategory {
  id: number;
  name: string;
  discount: string;
  status: string;
}

export interface ProductCustomerCategory {
  id: number;
  product_id: string;
  price: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Product {
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
  product_unit_id: string;
  uom_product_unit_id: number;
  product_unit: ProductUnit;
  uom_product_unit: ProductUnit;
}

export interface ProductUnit {
  id: number;
  name: string;
  ar_name: string;
}
