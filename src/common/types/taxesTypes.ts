export type Taxes = {
  id: number;
  name: string;
  rate: number;
  status: '0' | '1';
};

export interface TaxesStatusOption {
  label: string;
  value: '0' | '1';
}

export type TaxesPayload = {
  name: string;
  rate: number;
  status: '0' | '1';
};
