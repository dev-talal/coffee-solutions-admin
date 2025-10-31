import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import AddRegionDialog from '@/components/forms/region/RegionDialogue';
import DialogOption from '@/components/dashboard/Dialogue';
import {
  useAddRegionMutation,
  useDeleteRegionMutation,
  useEditRegionMutation,
  useRegionsQuery,
} from '@/features/api/regions/regionApi';

import { useTranslation } from 'react-i18next';
import { getRegionColumns } from '@/components/dashboard/popularGrid/columnData/regionData';
import type { Region, RegionPayload } from '@/common/types/regionTypes';
import { useDebounce } from '@/hooks/useDebounce';

function RegionGrid() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const columns = useMemo(() => getRegionColumns(t, i18n), [t, i18n]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Region | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [page, setPage] = useState(1);

  const { data, refetch, isLoading, isFetching } = useRegionsQuery(
    { page, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addRegion, { isLoading: isAdding }] = useAddRegionMutation();
  const [deleteRegion, { isLoading: isDeleting }] = useDeleteRegionMutation();
  const [editRegion, { isLoading: isEditing }] = useEditRegionMutation();

  const handleAddRegion = async (payload: RegionPayload) => {
    if (editData) {
      await editRegion({ id: editData.id, data: payload }).unwrap();
    } else {
      await addRegion(payload).unwrap();
    }
    setOpenDialog(false);
    await refetch();
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

  const handleView = (row: Region) => {
    navigate(`/regions/${row.id}`);
  };

  const handleEdit = (row: Region) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Region) => {
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
      <CustomDataTable<Region>
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
        Button4={{
          show: true,
          label: t('common.add_new') + ' ' + t('sidebar.regions'),
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

      {openDialog && (
        <AddRegionDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddRegion}
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

export default RegionGrid;
