export type DriverStatus = '1' | '0';

export type DriverWarehouse = {
  id: number;
  name: string;
};

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  mobile_no: string;
  status: DriverStatus;
  warehouses: DriverWarehouse[];
  created_at?: string;
}

export interface DriverPayload {
  first_name: string;
  last_name: string;
  mobile_no: string;
  status: number;
  warehouse_ids: { id: number }[];
}
