import { useEffect, useState, useMemo } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import type { ProductUnit } from '@/common/types/productTypes';
import { getProductUnitsColumns } from './columnData/productUnits';
import {
  useAddProductUnitMutation,
  useDeleteProductUnitMutation,
  useEditProductUnitMutation,
  useProductUnitsQuery,
} from '@/features/api/products/productUnitApi';
import AddProductUnitDialogue from '@/components/forms/product/AddProductUnitDialogue';
import type { ProductUnitValues } from '@/utils/validations/product';

function ProductUnitsGrid() {
  const { t, i18n } = useTranslation();
  const columns = useMemo(() => getProductUnitsColumns(t, i18n), [t, i18n]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<ProductUnit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<ProductUnit | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useProductUnitsQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addUnit, { isLoading: isAdding }] = useAddProductUnitMutation();
  const [deleteRegion, { isLoading: isDeleting }] = useDeleteProductUnitMutation();
  const [editUnit, { isLoading: isEditing }] = useEditProductUnitMutation();

  const handleAddProductUnit = async (payload: ProductUnitValues) => {
    if (editData) {
      await editUnit({ id: editData.id, data: payload }).unwrap();
    } else {
      await addUnit(payload).unwrap();
    }

    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRegion) return;

    const isLastItemOnPage = data?.data.length === 1;
    const currentPage = data?.meta.current_page ?? 1;

    await deleteRegion(selectedRegion.id).unwrap();
    setDeleteDialogOpen(false);

    if (isLastItemOnPage && currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleEdit = (row: ProductUnit) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: ProductUnit) => {
    setSelectedRegion(row);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!openDialog) {
      setEditData(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<ProductUnit>
        columns={columns}
        data={data?.data || []}
        {...(data?.meta && {
          pagination: data.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        filterColumn="name"
        enableRowSelection
        searchPlaceholder={t('common.search')}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        showSearch
        Button1={{
          show: true,
          label: t('common.add_new') + ' ' + t('common.product_unit'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        actions={{
          showEdit: true,
          showDelete: true,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        loading={isLoading}
      />

      {openDialog && (
        <AddProductUnitDialogue
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddProductUnit}
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
            `${t('common.delete_region_dialogue')}`,
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

export default ProductUnitsGrid;
