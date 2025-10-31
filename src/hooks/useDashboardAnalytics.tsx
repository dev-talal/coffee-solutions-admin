import { useMemo } from 'react';
import { format } from 'date-fns';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useSalesGraphQuery,
  useGetCardsGraphQuery,
  useGetPerformanceGraphQuery,
} from '@/features/api/dashboard/graphApi';
import type { DashboardChartsData } from '@/common/types/chartTypes';

export interface GraphRange {
  from: Date;
  to?: Date;
}

export const useDashboardData = (range: GraphRange): DashboardChartsData => {
  const now = new Date();
  const queryArgs = useMemo(
    () => ({
      start_date: format(range.from, 'yyyy-MM-dd'),
      end_date: range.to ? format(range.to, 'yyyy-MM-dd') : format(now, 'yyyy-MM-dd'),
    }),
    [range, now],
  );
  const hasRange = Boolean(queryArgs.start_date && queryArgs.end_date);
  const graphConfig: { start_date: string; end_date: string } | typeof skipToken = useMemo(
    () =>
      hasRange ? { start_date: queryArgs.start_date, end_date: queryArgs.end_date } : skipToken,
    [hasRange, queryArgs],
  );

  const {
    data: cardsData,
    isLoading: isCardsLoading,
    isSuccess: isCardsSuccess,
  } = useGetCardsGraphQuery(graphConfig, {
    skip: !hasRange,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: salesData,
    isLoading: isSalesLoading,
    isSuccess: isSalesSuccess,
  } = useSalesGraphQuery(isCardsSuccess ? graphConfig : skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    isSuccess: isPerformanceSuccess,
  } = useGetPerformanceGraphQuery(isCardsSuccess ? undefined : skipToken, {
    refetchOnMountOrArgChange: true,
  });

  return {
    sales: { data: salesData, isLoading: isSalesLoading, isSuccess: isSalesSuccess },
    cards: { data: cardsData, isLoading: isCardsLoading, isSuccess: isCardsSuccess },
    performance: {
      data: performanceData,
      isLoading: isPerformanceLoading,
      isSuccess: isPerformanceSuccess,
    },
  };
};
