import { MoveUpRight } from 'lucide-react';
import { lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  DashboardCardsSkeleton,
  DashboardPerformanceSkeleton,
  DashboardProductsSkeleton,
  DashboardSalesSkeleton,
} from '@/components/skeletons/DashboardSkeleton';
import { useDashboardData } from '@/hooks/useDashboardAnalytics';
import type { CardsGraphData } from '@/common/types/chartTypes';
import { StepWrapper } from '@/components/common/StepSuspense';

const ChartPerformanceCard = lazy(() => import('@/components/dashboard/ChartPerformanceCard'));
const ChartRevenueSaleCard = lazy(() => import('@/components/dashboard/ChartRevenueSaleCard'));
const ChartStatsCard = lazy(() => import('@/components/dashboard/ChartStatsCard'));
const DashProductGrid = lazy(() => import('@/components/dashboard/popularGrid/DashboardGrid'));

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const [range, setRange] = useState<{ from: Date; to?: Date }>({ from: defaultFrom, to: now });
  const { sales, cards, performance } = useDashboardData(range);

  const [step, setStep] = useState<'cards' | 'sales' | 'performance' | 'products' | null>(null);

  useEffect(() => {
    if (cards.data && !step) setStep('cards');
    else if (sales.data && step === 'cards') setStep('sales');
    else if (performance.data && step === 'sales') setStep('performance');
    else if (step === 'performance') setStep('products');
  }, [cards.data, sales.data, performance.data, step]);

  return (
    <div className="flex flex-col gap-4">
      <StepWrapper fallback={<DashboardCardsSkeleton />} isDataReady={!!cards.data}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.data &&
            Object.keys(cards.data).map((key, index) => {
              const value = cards.data![key as keyof CardsGraphData];
              return (
                <div key={index}>
                  <ChartStatsCard cardIndex={index} title={t(`chartStats.${key}`)} value={value} />
                </div>
              );
            })}
        </div>
      </StepWrapper>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <StepWrapper fallback={<DashboardSalesSkeleton />} isDataReady={!!sales.data}>
            {sales.data && (
              <ChartRevenueSaleCard salesData={sales.data} range={range} setRange={setRange} />
            )}
          </StepWrapper>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <StepWrapper fallback={<DashboardPerformanceSkeleton />} isDataReady={!!performance.data}>
            {performance.data && <ChartPerformanceCard performanceData={performance.data} />}
          </StepWrapper>
        </div>
        <StepWrapper fallback={<DashboardProductsSkeleton />} isDataReady={true}>
          <div className="col-span-12 mt-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{t('dashboardProducts.popular_products')}</h1>
              <h1
                className="text-md font-bold cursor-pointer flex items-center"
                onClick={() => navigate('/products')}
              >
                {t('dashboardProducts.show_all')}
                <MoveUpRight className="h-4 w-4 ml-1 rtl:rotate-270" />
              </h1>
            </div>
            <DashProductGrid />
          </div>
        </StepWrapper>
      </div>
    </div>
  );
};

export default DashboardPage;
