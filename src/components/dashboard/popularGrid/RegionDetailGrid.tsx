import { useEffect, useState, useMemo } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import AddCityDialog from '@/components/forms/city/AddCityDialogue';
import DialogOption from '@/components/dashboard/Dialogue';
import { getCitiesColumns } from '@/components/dashboard/popularGrid/columnData/citiesData';
import {
  useAddCityMutation,
  useCitiesQuery,
  useDeleteCityMutation,
  useEditCityMutation,
} from '@/features/api/regions/citiesApi';
import type { City } from '@/common/types/cityTypes';
import type { CityValues } from '@/utils/validations/region';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  region_id: string;
}

const RegionCityGrid = ({ region_id }: Props) => {
  const { t, i18n } = useTranslation();
  const columns = useMemo(() => getCitiesColumns(t, i18n), [t, i18n]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isFetching, refetch } = useCitiesQuery(
    { page, region_id, search: debouncedSearch },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [addCity, { isLoading: isLoadingAdd }] = useAddCityMutation();
  const [editCity, { isLoading: isLoadingEdit }] = useEditCityMutation();
  const [deleteCity, { isLoading: isLoadingDelete }] = useDeleteCityMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleAddCity = async (values: CityValues) => {
    const payload = { ...values, region_id };

    if (selectedCity) {
      await editCity({ id: selectedCity.id, data: payload }).unwrap();
    } else {
      await addCity(payload).unwrap();
    }

    setOpenDialog(false);
    await refetch();
  };

  const handleEdit = (row: City) => {
    setSelectedCity(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: City) => {
    setSelectedCity(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCity) {
      await deleteCity(selectedCity.id).unwrap();
      setDeleteDialogOpen(false);
      await refetch();
    }
  };

  useEffect(() => {
    if (!openDialog) setSelectedCity(null);
  }, [openDialog]);

  return (
    <>
      <CustomDataTable<City>
        columns={columns}
        data={data?.data?.cities?.data || []}
        pagination={data?.data?.cities?.meta}
        onPageChange={setPage}
        filterColumn="name"
        enableRowSelection
        searchPlaceholder={t('common.search_cities')}
        Button4={{
          show: true,
          label: t('common.add_cities'),
          buttonType: 'add',
          onClick: () => setOpenDialog(true),
        }}
        showSearch
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
        loading={isLoading}
      />

      {openDialog && region_id && (
        <AddCityDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onAdd={handleAddCity}
          loading={isLoadingAdd || isLoadingEdit}
          editData={selectedCity}
          region_id={region_id}
        />
      )}

      {deleteDialogOpen && (
        <DialogOption
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          dialogData={[t('common.delete_city_dialogue'), t('common.cancel'), t('common.delete')]}
          loading={isLoadingDelete}
          loadingText={t('common.deleting')}
        />
      )}
    </>
  );
};

export default RegionCityGrid;
