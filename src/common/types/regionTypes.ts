export interface Region {
  id: number;
  name: string;
  ar_name: string;
  status: '0' | '1';
}

export interface RegionStatusOption {
  label: string;
  value: '0' | '1';
}

export interface RegionPayload {
  name: string;
  ar_name: string;
  status: RegionStatusOption['value'];
}
