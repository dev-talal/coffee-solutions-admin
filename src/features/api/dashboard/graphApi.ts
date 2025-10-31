import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@/services/axios';
import { config } from '@/config';
import type {
  CardsGraphData,
  PerformanceChartData,
  SalesChartData,
} from '@/common/types/chartTypes';

const QueryTags: string[] = ['graph'];

export const graphApi = createApi({
  reducerPath: 'graphApi',
  baseQuery: axiosBaseQuery({
    baseUrl: config.API_BASE_URL,
  }),
  tagTypes: QueryTags,
  endpoints: (build) => ({
    salesGraph: build.query<SalesChartData[], { start_date: string; end_date: string }>({
      query: (data) => ({
        url: `/dashboard/custom/sales/grapgh`,
        method: 'POST',
        data: data,
      }),
      transformResponse: (response: { data: SalesChartData[] }) => response.data || [],
    }),
    getPerformanceGraph: build.query({
      query: () => ({
        url: `/dashboard/today/performence`,
        method: 'GET',
      }),
      transformResponse: (response: PerformanceChartData) => response || [],
    }),
    getCardsGraph: build.query({
      query: (data: { start_date: string; end_date: string }) => ({
        url: `/dashboard/cards/data`,
        method: 'POST',
        data: data,
      }),
      transformResponse: (response: { data: CardsGraphData }) => response.data || [],
    }),
  }),
});

export const { useSalesGraphQuery, useGetPerformanceGraphQuery, useGetCardsGraphQuery } = graphApi;
