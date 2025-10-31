import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getRolesColumns } from '@/components/dashboard/popularGrid/columnData/rolesData';
import RolesDialogue from '@/components/forms/roles/RolesDialogue';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useEditRoleMutation,
  useRolesQuery,
} from '@/features/api/roles/roleApi';
import type { Role, RolePayload } from '@/common/types/roleType';
import { useDebounce } from '@/hooks/useDebounce';

export default function RolesGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const {
    data: roles,
    isLoading,
    refetch,
    isFetching,
  } = useRolesQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addRole, { isLoading: isLoadingAddRole }] = useAddRoleMutation();
  const [editRole, { isLoading: isLoadingEdit }] = useEditRoleMutation();
  const [deleteRole, { isLoading: isLoadingDelete }] = useDeleteRoleMutation();
  const columns = getRolesColumns(t);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleAddNew = async (data: RolePayload) => {
    if (!selectedRole) await addRole(data).unwrap();
    else await editRole({ id: selectedRole.id, data }).unwrap();
    setOpenDialog(false);
    await refetch();
  };

  const handleEdit = (row: Role) => {
    setOpenDialog(true);
    setSelectedRole(row);
  };

  const handleDelete = (row: Role) => {
    setSelectedRole(row);
    setDeleteDialogOpen(true);
  };

  const handleView = (row: Role) => {
    navigate(`/roles/${row.id}`);
  };

  const handleConfirmDelete = async () => {
    if (selectedRole) {
      await deleteRole(selectedRole.id).unwrap();
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (!openDialog) setSelectedRole(null);
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Role>
        data={roles?.data || []}
        pagination={roles?.meta}
        onPageChange={setPage}
        columns={columns}
        filterColumn="name"
        showSearch
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        searchPlaceholder={t('common.search_role')}
        enableRowSelection
        Button4={{
          show: true,
          label: t('common.add_new_role'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        actions={{
          showView: false,
          showEdit: true,
          showDelete: true,
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        loading={isLoading}
      />
      {openDialog && (
        <RolesDialogue
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddNew}
          loading={isLoadingAddRole || isLoadingEdit}
          editData={selectedRole}
        />
      )}
      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_role_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={isLoadingDelete}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}
