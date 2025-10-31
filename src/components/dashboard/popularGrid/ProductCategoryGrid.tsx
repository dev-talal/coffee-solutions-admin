import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getProductsCategoryColumns } from '@/components/dashboard/popularGrid/columnData/productCategoryData';
import {
  useProductCategoriesQuery,
  useAddProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useEditProductCategoryMutation,
} from '@/features/api/products/productCateogry';
import type { Product, ProductPayload } from '@/common/types/productCategoryTypes';
import DialogOption from '@/components/dashboard/Dialogue';
import AddDialog from '@/components/forms/product/AddCategory';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

function CustCategoryGrid() {
  const { t, i18n } = useTranslation();

  const columns = getProductsCategoryColumns(t, i18n);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, refetch, isLoading, isFetching } = useProductCategoriesQuery(
    { page, search: debouncedSearch },
    { refetchOnMountOrArgChange: true },
  );

  const [addProductCategory, { isLoading: isLoadingAdd }] = useAddProductCategoryMutation();
  const [editProductCategory, { isLoading: isLoadingEdit }] = useEditProductCategoryMutation();
  const [deleteProductCategory, { isLoading: isLoadingDelete }] =
    useDeleteProductCategoryMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddNew = async (data: ProductPayload) => {
    let finalIcon = null;

    if (data.icon instanceof FileList && data.icon.length > 0) {
      finalIcon = data.icon[0];
    }

    const payload: ProductPayload = {
      name: data.name,
      ar_name: data.ar_name,
      icon: finalIcon,
      status: data.status,
      parent_id: data.parent_id ? String(data.parent_id) : null,
    };

    if (selectedProduct) {
      await editProductCategory({ id: selectedProduct.id, data: payload }).unwrap();
    } else {
      await addProductCategory(payload).unwrap();
    }

    setOpenDialog(false);
    setSelectedProduct(null);
    await refetch();
  };

  const handleEdit = (row: Product) => {
    setSelectedProduct(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: Product) => {
    setSelectedProduct(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProductCategory(selectedProduct.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <>
      <CustomDataTable<Product>
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta}
        onPageChange={setPage}
        filterColumn="name"
        enableRowSelection={true}
        searchPlaceholder={t('common.search_category')}
        showSearch={true}
        searchAction={{
          onChange: setSearch,
          value: search,
          loading: isFetching,
        }}
        actions={{
          showView: false,
          showEdit: true,
          showDelete: true,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
        Button4={{
          show: true,
          label: t('common.add_new_category'),
          buttonType: 'add',
          onClick: () => {
            setSelectedProduct(null);
            setOpenDialog(true);
          },
        }}
        loading={isLoading}
      />

      {openDialog && (
        <AddDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddNew}
          loading={isLoadingAdd || isLoadingEdit}
          editData={selectedProduct}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[
            t('common.delete_category_dialogue'),
            t('common.cancel'),
            t('common.delete'),
          ]}
          loading={isLoadingDelete}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
}

export default CustCategoryGrid;
