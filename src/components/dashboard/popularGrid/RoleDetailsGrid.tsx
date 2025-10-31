import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import {
  getRoleDetailsColumns,
  roleDetailsRow,
  type RoleDetail,
} from '@/components/dashboard/popularGrid/columnData/roleDetailsData';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';

export default function RoleDetailsGrid() {
  const { t } = useTranslation();
  const columns = getRoleDetailsColumns(t);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);

  const handleEdit = (row: RoleDetail) => {
    console.log('Edit role:', row);
  };

  const handleDelete = (row: RoleDetail) => {
    setSelectedRole(row);
    setDeleteDialogOpen(true);
    console.log('Delete role:', row);
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      console.log('Role deleted:', selectedRole);
      setDeleteDialogOpen(false);
    }
  };
  return (
    <>
      <CustomDataTable
        columns={columns}
        data={roleDetailsRow}
        filterColumn="name"
        searchPlaceholder={t('common.search_role')}
        showSearch={false}
        enableRowSelection
        actions={{
          showEdit: true,
          showDelete: true,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_role_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={false}
        />
      )}
    </>
  );
}
