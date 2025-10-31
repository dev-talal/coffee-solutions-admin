import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { PerformanceChartData } from '@/common/types/chartTypes';

export default function ChartPerformanceCard({
  performanceData,
}: {
  performanceData: PerformanceChartData;
}) {
  const { t } = useTranslation();

  const today = Number(performanceData?.today ?? 0);
  const yesterday = Number(performanceData?.yesterday ?? 0);
  const change = Number(performanceData?.change ?? 100);

  const isPositive = change >= 0;

  const radius = 100;
  const strokeWidth = 10;

  const [revenueProgress, setRevenueProgress] = useState(0);
  const revenueRadius = radius - strokeWidth;
  const revenueCircumference = revenueRadius * Math.PI;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const progress = yesterday > 0 ? Math.min(Math.abs((today / yesterday) * 100), 100) : 100;
      setRevenueProgress(progress);
    }, 300);

    return () => clearTimeout(timeout);
  }, [today, yesterday]);

  const revenueOffset = useMemo(
    () => revenueCircumference - (revenueProgress / 100) * revenueCircumference,
    [revenueProgress, revenueCircumference],
  );

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">{t('chartPerformance.title')}</h3>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="flex justify-center px-4">
          <div className="relative w-full">
            <svg
              width="100%"
              height="250"
              viewBox={`0 0 ${radius * 2} ${radius + 20}`}
              className="transition-transform"
            >
              <path
                d={`M ${strokeWidth} ${radius} A ${revenueRadius} ${revenueRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
                fill="none"
                stroke="#D9D9D9"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              <path
                d={`M ${strokeWidth} ${radius} A ${revenueRadius} ${revenueRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
                fill="none"
                stroke="var(--chart-1)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${revenueCircumference} ${revenueCircumference}`}
                strokeDashoffset={revenueOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-[50px]">
              <div className="text-2xl sm:text-3xl font-bold">
                {t('common.sar')}
                <CountUp end={today} decimals={2} duration={1.5} />
              </div>
              <div className="text-xs sm:text-sm mt-1">{t('chartPerformance.todaySales')}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 w-full">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
          <span className="text-lg lg:text-sm xl:text-base 2xl:text-lg font-bold">
            {t('chartPerformance.sales')}
          </span>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <DynamicIcon
              name={isPositive ? 'trending-up' : 'trending-down'}
              className="w-3 h-3 mr-1"
            />
            <span className="text-lg lg:text-sm xl:text-base 2xl:text-lg font-bold">{change}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center w-full text-lg lg:text-sm xl:text-base 2xl:text-lg font-bold">
          <span>{t('chartPerformance.yesterday')}</span>
          <span>
            {t('common.sar')}
            <CountUp end={yesterday} decimals={2} duration={1.5} />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
