import { useEffect, useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getCustomerColumns } from '@/components/dashboard/popularGrid/columnData/customerData';
import DialogOption from '@/components/dashboard/Dialogue';
import CustomerDialog from '@/components/forms/customer/CustomerDialogue';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router';

import {
  useAddCustomerMutation,
  useCustomerQuery,
  useEditCustomerMutation,
  useDeleteCustomerMutation,
} from '@/features/api/customer/index';
import type { Customer } from '@/common/types/customerTypes';
import type { CustomerValues } from '@/utils/validations/customer';

function CustomerGrid() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = getCustomerColumns(t);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, refetch, isLoading, isFetching } = useCustomerQuery(
    {
      page,
      search: debouncedSearch,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addCustomer, { isLoading: isLoadingAdd }] = useAddCustomerMutation();
  const [editCustomer, { isLoading: isLoadingEdit }] = useEditCustomerMutation();
  const [deleteCustomer, { isLoading: isLoadingDelete }] = useDeleteCustomerMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddNew = async (data: CustomerValues) => {
    if (selectedCustomer) {
      await editCustomer({ id: selectedCustomer.id, data }).unwrap();
    } else {
      await addCustomer(data).unwrap();
    }

    setOpenDialog(false);
    await refetch();
  };

  const handleEdit = (row: Customer) => {
    setSelectedCustomer(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Customer) => {
    setSelectedCustomer(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      await deleteCustomer(selectedCustomer.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      await refetch();
    }
  };

  const handleShowOrder = (row: Customer) => {
    navigate(`/customer/${row.id}/cart`);
  };

  useEffect(() => {
    if (!openDialog) {
      setSelectedCustomer(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Customer>
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta}
        onPageChange={setPage}
        enableRowSelection={true}
        searchPlaceholder={t('common.search_customer')}
        showSearch={true}
        searchAction={{
          value: search,
          onChange: setSearch,
          loading: isFetching,
        }}
        Button4={{
          show: true,
          label: t('common.add_new_customer'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        actions={{
          showOrder: true,
          showEdit: true,
          showDelete: true,
          onOrder: handleShowOrder,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        loading={isLoading}
      />

      {openDialog && (
        <CustomerDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddNew}
          loading={isLoadingAdd || isLoadingEdit}
          editData={selectedCustomer}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            t('common.delete_customer_dialogue'),
            t('common.cancel'),
            t('common.delete'),
          ]}
          loading={isLoadingDelete}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}

export default CustomerGrid;
