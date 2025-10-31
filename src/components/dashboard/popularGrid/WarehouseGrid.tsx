import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getWarehouseColumns } from '@/components/dashboard/popularGrid/columnData/warehouseData';
import { useTranslation } from 'react-i18next';
import DialogOption from '@/components/dashboard/Dialogue';
import AddWarehouseDialog from '@/components/forms/warehouse/WarehouseDialogue';
import type { WarehouseFormValues } from '@/utils/validations/warehouse';
import {
  useAddWarehouseMutation,
  useDeleteWarehouseMutation,
  useEditWarehouseMutation,
  useWarehouseQuery,
} from '@/features/api/warehouse/wareHouseApi';
import type { Warehouse } from '@/common/types/warehouseTypes';
import { useDebounce } from '@/hooks/useDebounce';

function WarehouseGrid() {
  const { t, i18n } = useTranslation();
  const columns = getWarehouseColumns(t, i18n);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const {
    data: warehouses,
    isLoading,
    isFetching,
    refetch,
  } = useWarehouseQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addWarehouse, { isLoading: isWarehouseAddLoading }] = useAddWarehouseMutation();
  const [editWarehouse, { isLoading: isWarehouseEditLoading }] = useEditWarehouseMutation();
  const [deleteWarehouse, { isLoading: isWarehouseDeleteLoading }] = useDeleteWarehouseMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const handleAddNew = () => {
    setSelectedWarehouse(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: Warehouse) => {
    setSelectedWarehouse(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Warehouse) => {
    setSelectedWarehouse(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedWarehouse) {
      await deleteWarehouse(selectedWarehouse.id);
      setDeleteDialogOpen(false);
      setSelectedWarehouse(null);
    }
  };

  const handleAddSubmit = async (data: WarehouseFormValues) => {
    if (selectedWarehouse) {
      await editWarehouse({
        id: selectedWarehouse.id,
        data: data,
      }).unwrap();
    } else {
      await addWarehouse(data).unwrap();
    }

    refetch();
    setOpenDialog(false);
  };

  return (
    <>
      <CustomDataTable<Warehouse>
        columns={columns}
        data={warehouses?.data || []}
        filterColumn="regions"
        pagination={warehouses?.meta}
        onPageChange={setPage}
        enableRowSelection={true}
        showSearch={true}
        searchPlaceholder={t('common.search_warehouse')}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        Button4={{
          show: true,
          label: t('common.add_new_warehouse'),
          buttonType: 'add',
          onClick: handleAddNew,
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
        <AddWarehouseDialog
          open={openDialog}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedWarehouse(null);
            }
            setOpenDialog(open);
          }}
          onAdd={handleAddSubmit}
          editData={selectedWarehouse}
          loading={isWarehouseAddLoading || isWarehouseEditLoading}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            t('common.delete_warehouse_dialogue'),
            t('common.cancel'),
            t('common.delete'),
          ]}
          loadingText={t('common.deleting')}
          loading={isWarehouseDeleteLoading}
        />
      )}
    </>
  );
}

export default WarehouseGrid;
