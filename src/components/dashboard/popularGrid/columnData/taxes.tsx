import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import type { Taxes } from '@/common/types/taxesTypes';

export function useTaxesColumns(): ColumnDef<Taxes>[] {
  const { t } = useTranslation();

  return useMemo<ColumnDef<Taxes>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => t('common.id'),
        cell: ({ row }) => <span>{row.getValue('id')}</span>,
      },
      {
        accessorKey: 'name',
        header: () => t('common.tax_name'),
        cell: ({ row }) => <span>{row.getValue('name')}</span>,
      },
      {
        accessorKey: 'rate',
        header: () => t('common.rate'),
        cell: ({ row }) => <span>{row.getValue('rate')}%</span>,
      },
      {
        accessorKey: 'status',
        header: () => t('common.status'),
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const colorClass = getStatusColorDual(status);
          return (
            <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {status == '1' ? t('common.status_active') : t('common.status_inactive')}
            </span>
          );
        },
      },
    ],
    [t],
  );
}
