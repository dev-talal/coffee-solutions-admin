import { useEffect } from 'react';
import type { Staff } from '@/common/types/staffTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, type StaffValues } from '@/utils/validations/staff';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/forms/context/FormInput';
import { useAllRolesQuery } from '@/features/api/roles/roleApi';
import { FormSelect } from '../context/FormSelect';
import { useAllWareHouseQuery } from '@/features/api/warehouse/wareHouseApi';
import type { Warehouse } from '@/common/types/warehouseTypes';
import LoadingButton from '@/components/common/LoadingButton';
import { FormPhoneInput } from '../context/FormPhoneInput';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: StaffValues) => void;
  loading?: boolean;
  editData?: Staff | null;
};

const StaffDialog = ({ open, onOpenChange, loading = false, editData, onAdd }: Props) => {
  const { data: roles, isLoading } = useAllRolesQuery(undefined);
  const { data: warehouses, isLoading: isLoadingRegion } = useAllWareHouseQuery(undefined);

  const methods = useForm({
    resolver: zodResolver(staffSchema(t)),
    defaultValues: {
      email: '',
      phone: '+966',
      first_name: '',
      last_name: '',
      role: '',
      password: '',
      location: '',
      warehouse_ids: [],
    },
  });

  const handleSubmit = (row: StaffValues) => {
    onAdd(row);
  };

  useEffect(() => {
    if (editData) {
      const regionIds = editData.warehouses.map(({ id }) => id.toString());
      methods.reset({
        id: editData.id,
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        phone: editData.phone,
        role: editData.role,
        employe_number: editData.employe_number,
        location: editData.location || '',
        warehouse_ids: regionIds,
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-card text-card-foreground flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new') : t('common.edit')} {t('sidebar.staff')}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('sidebar.staff') + '. '}
            </p>
          )}
        </DialogHeader>
        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2">
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">{t('common.first_name')}</Label>
                  <FormInput
                    name="first_name"
                    className="rounded-full w-full"
                    id="first_name"
                    placeholder={`${t('common.enter')} ${t('common.first_name')}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">{t('common.last_name')}</Label>
                  <FormInput
                    name="last_name"
                    className="rounded-full w-full"
                    id="last_name"
                    placeholder={`${t('common.enter')} ${t('common.last_name')}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <FormInput
                    name="email"
                    type="email"
                    className="rounded-full w-full"
                    id="email"
                    placeholder={`${t('common.enter')} ${t('common.email')}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('common.phoneNumber')}</Label>
                  <FormPhoneInput
                    name="phone"
                    label="Phone Number"
                    defaultCountry="us"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('common.role')}</Label>
                  <FormSelect
                    name="role"
                    placeholder={t('common.select_role') + '...'}
                    className="rounded-full w-full"
                    options={(roles || [])
                      .filter((x) => x.name !== 'customer')
                      .map((role) => ({
                        label: role.name,
                        value: role.name,
                      }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <FormInput
                    name="password"
                    className="rounded-full w-full"
                    id="password"
                    type="password"
                    placeholder={`${t('common.enter')} ${t('login.password')}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee_number">{t('common.employee_number')}</Label>
                  <FormInput
                    name="employe_number"
                    className="rounded-full w-full"
                    id="employee_number"
                    placeholder={`${t('common.enter')} ${t('common.employee_number')}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('common.location')}</Label>
                  <FormInput
                    name="location"
                    className="rounded-full w-full"
                    id="location"
                    placeholder={`${t('common.enter')} ${t('common.location')}`}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="region">{t('common.warehouse')}</Label>
                  <FormSelect
                    name="warehouse_ids"
                    className="rounded-full w-full"
                    id="region"
                    placeholder={`${t('common.select')} ${t('common.warehouse')}`}
                    options={(warehouses || []).map((r: Warehouse) => ({
                      label: r.name,
                      value: r.id.toString(),
                    }))}
                    multiple={true}
                    disabled={isLoadingRegion}
                  />
                </div>
              </div>
              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full "
                  label={
                    editData
                      ? `${t('common.update')} ${t('sidebar.staff')}`
                      : t('common.add_new_staff')
                  }
                />
              </div>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
