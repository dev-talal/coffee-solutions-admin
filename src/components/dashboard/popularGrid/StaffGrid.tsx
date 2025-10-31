import { useEffect, useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getStaffColumns } from '@/components/dashboard/popularGrid/columnData/staffData';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';
import {
  useAddStaffMutation,
  useDeleteStaffMutation,
  useEditStaffMutation,
  useStaffQuery,
} from '@/features/api/staff/staffApi';
import type { Staff } from '@/common/types/staffTypes';
import StaffDialog from '@/components/forms/staff/StaffDialog';
import type { StaffValues } from '@/utils/validations/staff';
import { useDebounce } from '@/hooks/useDebounce';

function StaffGrid() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const columns = getStaffColumns(t);
  const {
    data: staffRows,
    refetch,
    isLoading,
    isFetching,
  } = useStaffQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addStaff, { isLoading: isLoadingAddStaff }] = useAddStaffMutation();
  const [editStaff, { isLoading: isLoadingEditStaff }] = useEditStaffMutation();
  const [deleteStaff, { isLoading: isLoadingDeleteStaff }] = useDeleteStaffMutation();

  const handleEdit = (row: Staff) => {
    setSelectedStaff(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Staff) => {
    setDeleteOpenDialog(true);
    setSelectedStaff(row);
  };

  const handleConfirmDelete = async () => {
    if (selectedStaff) {
      await deleteStaff(selectedStaff.id).unwrap();
    }
    setDeleteOpenDialog(false);
  };

  const handleAddNew = async (payload: StaffValues) => {
    if (!selectedStaff?.id) await addStaff(payload).unwrap();
    else await editStaff({ id: selectedStaff.id, data: payload }).unwrap();
    setOpenDialog(false);
    await refetch();
  };

  useEffect(() => {
    if (!openDialog) setSelectedStaff(null);
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Staff>
        columns={columns}
        data={staffRows?.data || []}
        pagination={staffRows?.meta}
        onPageChange={setPage}
        filterColumn="first_name"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_staff')}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        showSearch={true}
        loading={isLoading}
        Button4={{
          show: true,
          label: t('common.add_new_staff'),
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
      />
      {openDialog && (
        <StaffDialog
          onAdd={handleAddNew}
          open={openDialog}
          onOpenChange={setOpenDialog}
          loading={isLoadingAddStaff || isLoadingEditStaff}
          editData={selectedStaff}
        />
      )}
      {openDeleteDialog && (
        <DialogOption
          open={openDeleteDialog}
          onOpenChange={setDeleteOpenDialog}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_staff_dialogue'), t('common.cancel'), t('common.delete')]}
          loadingText={t('common.deleting')}
          loading={isLoadingDeleteStaff}
        />
      )}
    </>
  );
}

export default StaffGrid;
