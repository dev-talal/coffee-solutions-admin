export type Product = {
  id: number;
  name: string;
  ar_name: string;
  icon: string;
  status: '0' | '1';
  parent_id?: string | null;
  parent?: {
    id: number | string;
    name: string;
    ar_name: string;
  } | null;
};

export interface ProductStatusOption {
  label: string;
  value: '0' | '1';
}

export type ProductPayload = {
  name: string;
  ar_name: string;
  icon: File | null;
  status: ProductStatusOption['value'];
  parent_id?: string | null;
};
