import { CustomDataTable } from '@/components/common/CustomDataTable';
import {
  categoryDetailsColumns,
  type CategoryDetails,
} from '@/components/dashboard/popularGrid/columnData/categorydetails';
import { useCustomerCategoryDetailsQuery } from '@/features/api/customer/CustomerCategoryApi';
import { useParams } from 'react-router';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';

type CustCategoryDetailsGridProps = {
  onEdit?: (row: CategoryDetails) => void;
  onDelete?: (row: CategoryDetails) => void;
};

function CustCategoryDetailsGrid({ onEdit, onDelete }: CustCategoryDetailsGridProps) {
  const param = useParams();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { isLoading, isFetching } = useCustomerCategoryDetailsQuery(
    {
      id: param.id || '',
      search: debouncedSearch,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  return (
    <CustomDataTable<CategoryDetails>
      columns={categoryDetailsColumns}
      data={[]}
      filterColumn="name"
      enableRowSelection={true}
      searchPlaceholder="Search Customer..."
      showSearch={true}
      searchAction={{
        onChange: setSearch,
        value: search,
        loading: isFetching,
      }}
      actions={{
        showEdit: !!onEdit,
        showDelete: !!onDelete,
        onEdit,
        onDelete,
      }}
      loading={isLoading}
    />
  );
}

export default CustCategoryDetailsGrid;
