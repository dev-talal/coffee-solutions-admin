import type { Region } from './regionTypes';
import type { Staff } from './staffTypes';

export type Warehouse = {
  id: number;
  name: string;
  ar_name: string;
  regions: Region[];
  date: string;
  status: '0' | '1';
  created_at: string;
};

export type CustomerCareUsers = {
  sales_users: Staff[];
  customer_care_users: Staff[];
};
