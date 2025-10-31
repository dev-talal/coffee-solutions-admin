import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getTransactionColumns } from '@/components/dashboard/popularGrid/columnData/transactionData';
import { useTranslation } from 'react-i18next';
import { useTransactionsQuery } from '@/features/api/transactions/transactionApi';
import { ChartNoAxesCombined } from 'lucide-react';
import { StatCard, SkeletonCard } from '@/components/dashboard/TransactionStatsCard';
import type { Transactions } from '@/common/types/transactionType';

function TransactionGrid() {
  const { t } = useTranslation();
  const columns = getTransactionColumns(t);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTransactionsQuery(
    { page },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const handleExport = () => {
    console.log('Export clicked');
  };

  const cardData = [
    {
      icon: <ChartNoAxesCombined size={24} />,
      title: t('common.activity'),
      amount: data?.data?.total_revenue || 0,
    },
    {
      icon: <ChartNoAxesCombined size={24} />,
      title: t('common.total'),
      amount: data?.data?.total_revenue || 0,
    },
    {
      icon: <ChartNoAxesCombined size={24} />,
      title: t('common.todayRevenue'),
      amount: data?.data?.today_revenue || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          : cardData.map((item, index) => (
              <StatCard key={index} icon={item.icon} title={item.title} amount={item.amount} />
            ))}
      </div>

      <CustomDataTable<Transactions>
        columns={columns}
        data={data?.data?.transactions?.data || []}
        loading={isLoading}
        {...(data?.data?.transactions?.meta && {
          pagination: data.data.transactions.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        showFilterBar={true}
        filterBarNames={[t('common.all_transactions'), t('common.recieved'), t('common.pending')]}
        filterColumn="id"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_tranction')}
        showSearch={false}
        Button1={{
          show: true,
          label: t('common.filter_by_date'),
          buttonType: 'date',
          onDateChange: (range) => {
            console.log('Selected date range:', range);
          },
        }}
        Button2={{
          show: true,
          label: t('common.export'),
          onClick: handleExport,
          buttonType: 'export',
        }}
      />
    </div>
  );
}

export default TransactionGrid;
