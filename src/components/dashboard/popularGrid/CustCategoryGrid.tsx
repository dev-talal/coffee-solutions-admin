import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getCustCategoryColumns } from '@/components/dashboard/popularGrid/columnData/custCategoryData';
import {
  useAddCustomerCategoryMutation,
  useCustomerCategoriesQuery,
  useDeleteCustomerCategoryMutation,
  useEditCustomerCategoryMutation,
} from '@/features/api/customer/CustomerCategoryApi';
import type {
  CustomerCategory,
  CustomerCategoryPayload,
} from '@/common/types/customerCategoryTypes';
import DialogOption from '@/components/dashboard/Dialogue';
import AddDialog from '@/components/forms/customerCategory/CustomerDialogue';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

function CustCategoryGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const columns = getCustCategoryColumns(t);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { data, refetch, isLoading, isFetching } = useCustomerCategoriesQuery(
    {
      page,
      search: debouncedSearch,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addCustomerCategory, { isLoading: isLoadingAdd }] = useAddCustomerCategoryMutation();
  const [editCustomerCategory, { isLoading: isLoadingEdit }] = useEditCustomerCategoryMutation();
  const [deleteCustomerCategory, { isLoading: isLoadingDelete }] =
    useDeleteCustomerCategoryMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CustomerCategory | null>(null);

  const handleAddNew = async (data: CustomerCategoryPayload) => {
    if (selectedCategory) {
      await editCustomerCategory({ id: selectedCategory.id, data }).unwrap();
    } else {
      await addCustomerCategory(data).unwrap();
    }

    setOpenDialog(false);
    await refetch();
  };

  const handleEdit = (row: CustomerCategory) => {
    setSelectedCategory(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: CustomerCategory) => {
    setSelectedCategory(row);
    setDeleteDialogOpen(true);
  };

  const handleView = (row: CustomerCategory) => {
    navigate(`/customer-category/${row.id}`);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await deleteCustomerCategory(selectedCategory.id).unwrap();
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (!openDialog) {
      setSelectedCategory(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<CustomerCategory>
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta}
        onPageChange={(page: number) => setPage(page)}
        filterColumn="name"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_category')}
        showSearch={true}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        Button4={{
          show: true,
          label: t('common.add_new_category'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        actions={{
          showView: true,
          showEdit: true,
          showDelete: true,
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        loading={isLoading}
      />

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            t('common.delete_category_dialogue'),
            t('common.cancel'),
            t('common.delete'),
          ]}
          loading={isLoadingDelete}
          loadingText={t('common.deleting')}
        />
      )}
      {openDialog && (
        <AddDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddNew}
          loading={isLoadingAdd || isLoadingEdit}
          editData={selectedCategory}
        />
      )}
    </>
  );
}

export default CustCategoryGrid;
