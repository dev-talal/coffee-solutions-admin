import type { Region } from './regionTypes';
import type { City } from './cityTypes';
import type { Warehouse } from './warehouseTypes';

export interface CustomerAddress {
  id: number;
  is_link: 0 | 1 | 2 | undefined;
  short_address: string;
  ar_short_address: string;
  building_number: string;
  ar_building_number: string;
  secondary_number: string;
  ar_secondary_number: string;
  country: string;
  ar_country: string;
  city: string;
  ar_city: string;
  postal_code: string;
  ar_postal_code: string;
  address_link: string;
  is_linked: 0 | 1 | 2;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer_code: string;
  registration_number: string;
  vat_number: string;
  region: Region;
  city: City;
  warehouse: Warehouse;
  customer_category_id: string;
  customer_care_id: string;
  credit_limit: number;
  company_name: string;
  delivery_address: CustomerAddress;
}

export type CustomerTransaction = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile: string;
  phone: string;
  created_at: Date;
  credit: number;
};
