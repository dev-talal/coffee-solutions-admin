import { useEffect, useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import TaxesDialog from '@/components/forms/taxes/TaxesDialogue';
import DialogOption from '@/components/dashboard/Dialogue';
import {
  useAddTaxesMutation,
  useDeleteTaxesMutation,
  useEditTaxesMutation,
  useTaxesQuery,
} from '@/features/api/taxes/taxApi';

import { useTranslation } from 'react-i18next';
import { useTaxesColumns } from './columnData/taxes';
import type { Taxes, TaxesPayload } from '@/common/types/taxesTypes';
import { useDebounce } from '@/hooks/useDebounce';

function RegionGrid() {
  const { t } = useTranslation();
  const columns = useTaxesColumns();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Taxes | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [SelectedTaxes, setSelectedTaxes] = useState<Taxes | null>(null);
  const [page, setPage] = useState(1);

  const { data, refetch, isLoading, isFetching } = useTaxesQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addTaxes, { isLoading: isAdding }] = useAddTaxesMutation();
  const [deleteTaxes, { isLoading: isDeleting }] = useDeleteTaxesMutation();
  const [editTaxes, { isLoading: isEditing }] = useEditTaxesMutation();

  const handleAddTaxes = async (payload: TaxesPayload) => {
    if (editData) {
      await editTaxes({ id: editData.id, data: payload }).unwrap();
    } else {
      await addTaxes(payload).unwrap();
    }
    setOpenDialog(false);
    await refetch();
  };

  const handleConfirmDelete = async () => {
    if (!SelectedTaxes) return;

    const isLastItemOnPage = data?.data.length === 1;
    const currentPage = data?.meta.current_page ?? 1;

    await deleteTaxes(SelectedTaxes.id).unwrap();
    setDeleteDialogOpen(false);

    if (isLastItemOnPage && currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleEdit = (row: Taxes) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Taxes) => {
    setSelectedTaxes(row);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!openDialog) {
      setEditData(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Taxes>
        columns={columns}
        data={data?.data || []}
        {...(data?.meta && {
          pagination: data.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        enableRowSelection
        searchPlaceholder={t('common.search')}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        showSearch
        Button4={{
          show: true,
          label: t('common.add_new') + ' ' + t('sidebar.taxes'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        actions={{
          showView: false,
          showEdit: true,
          showDelete: true,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        loading={isLoading}
      />

      {openDialog && (
        <TaxesDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddTaxes}
          loading={isAdding || isEditing}
          editData={editData}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            `${t('common.delete_tax_dialogue')}`,
            t('common.cancel'),
            t('common.delete'),
          ]}
          loading={isDeleting}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}

export default RegionGrid;
