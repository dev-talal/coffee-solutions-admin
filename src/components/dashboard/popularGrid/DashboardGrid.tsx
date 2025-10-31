import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getProductColumns } from '@/components/dashboard/popularGrid/columnData/dashboardData';
import { useTranslation } from 'react-i18next';
import { usePopularProductsQuery } from '@/features/api/dashboard/popularProductApi';
import type { PopularProducts } from '@/common/types/popularProductTypes';

function DashProductGrid() {
  const { t } = useTranslation();
  const columns = getProductColumns(t);
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePopularProductsQuery(
    { page },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <CustomDataTable<PopularProducts>
      columns={columns}
      data={data?.data || []}
      loading={isLoading}
      {...(data?.meta && {
        pagination: data.meta,
        onPageChange: (page: number) => setPage(page),
      })}
      filterColumn="name"
      enableRowSelection={false}
      showSearch={false}
    />
  );
}

export default DashProductGrid;
