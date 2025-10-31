export type BannerStatus = '1' | '0';

export type BannerCategory = {
  id: number;
  name: string;
  ar_name: string;
  icon: string;
};

export interface Banner {
  id: number;
  url: string;
  type: string;
  category: BannerCategory;
  created_at: string;
  updated_at: string;
}

export interface BannerPayload {
  url: string;
  type: string;
  category_id: string;
}
