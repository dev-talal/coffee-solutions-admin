import type { Warehouse } from './warehouseTypes';

export interface Staff {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  employe_number: string;
  location: string;
  role: string;
  warehouses: Warehouse[];
  created_at: string;
}

export interface StaffPayload {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}
