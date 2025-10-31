import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getPromotionColumns } from '@/components/dashboard/popularGrid/columnData/promotionsData';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';
import {
  useDeletePromotionMutation,
  usePromotionsQuery,
} from '@/features/api/promotions/promotionsApi';
import { useDebounce } from '@/hooks/useDebounce';
import type { Promotion } from '@/common/types/promotionTypes';

function PromotionGrid() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const columns = useMemo(() => getPromotionColumns(t, i18n), [t, i18n]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search);
  const {
    data: promotions,
    isLoading,
    isFetching,
  } = usePromotionsQuery({ page, search: debouncedSearch }, { refetchOnMountOrArgChange: true });
  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

  const handleView = (row: Promotion) => {
    navigate(`/promotions/${row.id}`);
  };

  const handleEdit = (row: Promotion) => {
    navigate(`/promotions/edit-promotions/${row.id}`);
  };

  const handleDelete = (row: Promotion) => {
    setSelectedPromotion(row);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    navigate('/promotions/add-promotions');
  };

  const handleConfirmDelete = async () => {
    if (selectedPromotion) {
      await deletePromotion(selectedPromotion.id).unwrap();
      setSelectedPromotion(null);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <CustomDataTable<Promotion>
        columns={columns}
        data={promotions?.data || []}
        showFilterBar={true}
        filterBarNames={[t('common.active'), t('common.inactive')]}
        filterColumn="name"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_promotions')}
        showSearch={true}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        {...(promotions?.meta && {
          pagination: promotions.meta,
          onPageChange: (page: number) => setPage(page),
        })}
        onPageChange={setPage}
        Button1={{
          show: true,
          label: t('common.filter_by_date'),
          buttonType: 'date',
          onDateChange: (range) => {
            console.log('Selected date range:', range);
          },
        }}
        Button2={{
          show: true,
          label: t('common.filter_by_price'),
          buttonType: 'price',
          onPriceChange: (range) => {
            console.log('Selected price range:', range);
          },
        }}
        Button4={{
          show: true,
          label: t('common.add_new_promotion'),
          buttonType: 'add',
          onClick: handleAddNew,
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
      {dialogOpen && (
        <DialogOption
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_product_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={isDeleting}
        />
      )}
    </>
  );
}

export default PromotionGrid;
