import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { usePermissionsQuery } from '@/features/api/roles/roleApi';
import { FormInput } from '../context/FormInput';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, type RoleValues } from '@/utils/validations/roles';
import { Checkbox } from '@/components/ui/checkbox';
import { FormTextarea } from '../context/FormTextarea';
import type { Role } from '@/common/types/roleType';
import { useEffect } from 'react';
import LoadingButton from '@/components/common/LoadingButton';
import { cn } from '@/lib/utils';
import { DynamicIcon } from 'lucide-react/dynamic';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { name: string; description?: string; permissions: string[] }) => void;
  loading: boolean;
  editData?: Role | null;
};

export default function AddRolesDialog({ open, onOpenChange, onAdd, loading, editData }: Props) {
  const { t } = useTranslation();
  const { data: permissions, isLoading } = usePermissionsQuery(undefined);

  const methods = useForm({
    resolver: zodResolver(roleSchema(t)),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  const handleSubmit = (row: RoleValues) => {
    onAdd(row);
  };

  useEffect(() => {
    if (editData) {
      methods.reset({
        name: editData.name || '',
        description: editData.description || '',
        permissions: editData.permissions || [],
      });
    }
  }, [editData, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-card text-card-foreground flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {!editData ? t('common.add_new_role') : `${t('common.edit')} ${t('common.role')}`}
          </DialogTitle>
          {!editData && (
            <p
              className={cn(
                'text-sm text-muted-foreground',
                document?.documentElement?.dir === 'rtl' && 'text-right',
              )}
            >
              {t('common.complete_form_to_add') + ' ' + t('common.role') + '. '}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...methods}>
          <div className="overflow-y-auto flex-1 max-h-[calc(90vh-100px)] px-2">
            <form className="space-y-4 w-full" onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="space-y-2 w-full">
                <Label>{t('common.role_name')}</Label>
                <FormInput
                  name="name"
                  className="rounded-full w-full"
                  placeholder={t('common.enter_role_name')}
                  readOnly={editData?.is_editable === '0'}
                />
              </div>

              <div className="space-y-2 w-full">
                <Label>{t('common.role_description')}</Label>
                <FormTextarea
                  className="w-full resize-y"
                  placeholder={t('common.enter_description')}
                  name="description"
                />
              </div>

              <div className="space-y-2 w-full">
                <Label>{t('common.permissions')}</Label>
                {!isLoading ? (
                  <Controller
                    name="permissions"
                    render={({ field }) => {
                      const { value = [], onChange } = field;

                      const handleToggle = (permission: string) => {
                        if (value.includes(permission)) {
                          onChange(value.filter((item: string) => item !== permission));
                        } else {
                          onChange([...value, permission]);
                        }
                      };

                      return (
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
                          {permissions?.map((opt) => (
                            <div className="space-y-2 w-fit" key={opt.name}>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                  checked={value.includes(opt.name)}
                                  onCheckedChange={() => handleToggle(opt.name)}
                                  className="rounded-full "
                                />
                                <span className="capitalize">{opt.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                ) : (
                  <div>
                    <DynamicIcon name="loader" className="animate-spin h-7 w-7 text-chart-1" />
                  </div>
                )}
                {methods.formState.errors.permissions && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.permissions.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  className="w-full rounded-full"
                  label={
                    editData
                      ? t('common.update') + ' ' + t('common.role')
                      : t('common.add_new_role')
                  }
                />
              </div>
            </form>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
