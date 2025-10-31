import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { City } from '@/common/types/cityTypes';
import type { i18n as I18nType } from 'i18next';

export const getCitiesColumns = (t: (key: string) => string, i18n: I18nType): ColumnDef<City>[] => [
  {
    accessorKey: 'name',
    header: t('common.city_name'),
    cell: ({ row }) => {
      const isRTL = i18n.dir() === 'rtl';
      const city = row.original;
      const name = isRTL ? city.ar_name : city.name;
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as City['status'];
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status === '1' ? t('common.active') : t('common.inactive')}
        </span>
      );
    },
  },
];
