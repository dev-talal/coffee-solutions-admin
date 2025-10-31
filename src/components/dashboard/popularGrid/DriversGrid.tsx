import { useEffect, useState, useMemo } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import AddDriver from '@/components/forms/drivers/addDrivers';
import DialogOption from '@/components/dashboard/Dialogue';
import {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from '@/features/api/drivers/driversApi';

import { useTranslation } from 'react-i18next';
import { getDriversColumns } from './columnData/driversData';
import type { Driver, DriverPayload } from '@/common/types/driverTypes';
import { useDebounce } from '@/hooks/useDebounce';

function DriversGrid() {
  const { t } = useTranslation();
  const columns = useMemo(() => getDriversColumns(t), [t]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Driver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [page, setPage] = useState(1);

  const { data, refetch, isLoading, isFetching } = useGetDriversQuery(
    { page, search: debouncedSearch },
    { refetchOnMountOrArgChange: true },
  );

  const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
  const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

  const handleAddDriver = async (payload: DriverPayload) => {
    if (editData) {
      await updateDriver({ id: editData.id, data: payload }).unwrap();
    } else {
      await createDriver(payload).unwrap();
    }
    setOpenDialog(false);
    await refetch();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;

    const isLastItemOnPage = data?.data.length === 1;
    const currentPage = data?.meta.current_page ?? 1;

    await deleteDriver(selectedDriver.id).unwrap();
    setDeleteDialogOpen(false);

    if (isLastItemOnPage && currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleEdit = (row: Driver) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Driver) => {
    setSelectedDriver(row);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!openDialog) {
      setEditData(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Driver>
        columns={columns}
        data={data?.data || []}
        {...(data?.meta && {
          pagination: data.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        filterColumn="mobile_no"
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
          label: t('common.add_new') + ' ' + t('common.driver'),
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
        <AddDriver
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddDriver}
          loading={isCreating || isUpdating}
          editData={editData}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_driver_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={isDeleting}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}

export default DriversGrid;
