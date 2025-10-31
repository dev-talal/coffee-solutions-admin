export type CustomerCategory = {
  id: number;
  name: string;
  discount: number;
  status: number;
};
export interface CategoryStatusOption {
  label: string;
  value: '0' | '1';
}

export type CustomerCategoryPayload = {
  name: string;
  discount: number;
  status: CategoryStatusOption['value'];
};
