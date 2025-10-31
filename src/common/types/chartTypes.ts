export interface SalesChartData {
  date: string;
  total_sales: string;
}

export interface PerformanceChartData {
  change: number;
  today: number;
  yesterday: number;
}

export interface CardsGraphData {
  total_customers: number | string;
  total_orders: number | string;
  total_sales: number | string;
}

export interface DashboardChartsData {
  sales: {
    data?: SalesChartData[];
    isLoading: boolean;
    isSuccess: boolean;
  };
  cards: {
    data?: CardsGraphData;
    isLoading: boolean;
    isSuccess: boolean;
  };
  performance: {
    data?: PerformanceChartData;
    isLoading: boolean;
    isSuccess: boolean;
  };
}
