import { useEffect, useState, useMemo } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import AddBanner from '@/components/forms/banner/addBanner';
import DialogOption from '@/components/dashboard/Dialogue';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '@/features/api/banner/bannerApi';

import { useTranslation } from 'react-i18next';
import { getBannersColumns } from './columnData/bannerData';
import type { Banner } from '@/common/types/bannerTypes';
import { useDebounce } from '@/hooks/useDebounce';
import type { BannerFormValues } from '@/utils/validations/banner';

export default function BannerGrid() {
  const { t } = useTranslation();
  const columns = useMemo(() => getBannersColumns(t), [t]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<Banner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [page, setPage] = useState(1);

  const { data, refetch, isLoading, isFetching } = useGetBannersQuery(
    { page, search: debouncedSearch },
    { refetchOnMountOrArgChange: true },
  );

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const handleAddBanner = async (payload: BannerFormValues) => {
    if (editData) {
      await updateBanner({ id: editData.id, data: payload }).unwrap();
    } else {
      await createBanner(payload).unwrap();
    }
    setOpenDialog(false);
    await refetch();
  };

  const handleConfirmDelete = async () => {
    if (!selectedBanner) return;

    const isLastItemOnPage = data?.data.length === 1;
    const currentPage = data?.meta.current_page ?? 1;

    await deleteBanner(selectedBanner.id).unwrap();
    setDeleteDialogOpen(false);

    if (isLastItemOnPage && currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleEdit = (row: Banner) => {
    setEditData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Banner) => {
    setSelectedBanner(row);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (!openDialog) {
      setEditData(null);
    }
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<Banner>
        columns={columns}
        data={data?.data || []}
        {...(data?.meta && {
          pagination: data.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        filterColumn="type"
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
          label: t('common.add_new') + ' ' + t('common.banner'),
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
        <AddBanner
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddBanner}
          loading={isCreating || isUpdating}
          editData={editData}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_banner_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={isDeleting}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}
