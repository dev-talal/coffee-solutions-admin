import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getProductColumns } from '@/components/dashboard/popularGrid/columnData/productData';
import DialogOption from '@/components/dashboard/Dialogue';
import { useTranslation } from 'react-i18next';
import { useDeleteProductMutation, useProductsQuery } from '@/features/api/products/productApi';
import { useDebounce } from '@/hooks/useDebounce';
import type { Product } from '@/common/types/productTypes';

function ProductGrid() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const columns = useMemo(() => getProductColumns(t, i18n), [t, i18n]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search);
  const {
    data: products,
    isLoading,
    isFetching,
  } = useProductsQuery({ page, search: debouncedSearch }, { refetchOnMountOrArgChange: true });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleView = (row: Product) => {
    navigate(`/products/${row.id}`);
  };

  const handleEdit = (row: Product) => {
    navigate(`/products/edit-products/${row.id}`);
  };

  const handleDelete = (row: Product) => {
    setSelectedProduct(row);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    navigate('/products/add-products');
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id).unwrap();
      setSelectedProduct(null);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <CustomDataTable<Product>
        columns={columns}
        data={products?.data || []}
        showFilterBar={true}
        filterBarNames={[t('common.all_products'), t('common.available'), t('common.out_of_stock')]}
        filterColumn="name"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_products')}
        showSearch={true}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        {...(products?.meta && {
          pagination: products.meta,
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
        Button3={{
          show: true,
          label: t('common.add_new_product'),
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

export default ProductGrid;
