import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

interface CardData {
  icon: React.ReactNode;
  title: string;
  amount: number;
}

export const StatCard: React.FC<CardData> = ({ icon, title, amount }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-4 rounded-xl">
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-green-500 text-xl bg-green-100 rounded-[10px] p-1">{icon}</div>
            <div className="text-lg font-bold dark:text-white">{title}</div>
          </div>
          <div>
            <div className="font-bold text-4xl">
              {t('common.sar')}
              <CountUp end={amount} separator="," decimals={2} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <Card className="p-4 rounded-xl animate-pulse">
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 rounded-[10px] w-8 h-8" />
            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-24 rounded" />
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 w-32 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};
