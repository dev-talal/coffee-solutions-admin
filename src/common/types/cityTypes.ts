import type { PaginatedResponse } from './commonTypes';
import type { Region } from './regionTypes';
export interface City {
  id: number;
  name: string;
  ar_name: string;
  status: '0' | '1';
  region: Region;
}

export interface CityPayload {
  name: string;
  ar_name: string;
  status: '0' | '1';
  region_id: string | undefined;
}

export interface SingleRegionCities {
  data: {
    region: Region;
    cities: PaginatedResponse<City>;
  };
}
