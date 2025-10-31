import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Region } from '@/common/types/regionTypes';
import type { i18n as I18nType } from 'i18next';
import TooltipCell from '@/components/common/TooltipCell';

export const getRegionColumns = (
  t: (key: string) => string,
  i18n: I18nType,
): ColumnDef<Region>[] => [
  {
    accessorKey: 'id',
    header: t('common.region_id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'name',
    header: t('common.region_name'),
    cell: ({ row }) => {
      const isRTL = i18n?.dir() === 'rtl';
      const region = row.original;
      const name = isRTL ? region.ar_name : region.name;
      return <TooltipCell value={name} />;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Region['status'];
      const colorClass = getStatusColorDual(status.toString());
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.status_active') : t('common.status_inactive')}
        </span>
      );
    },
  },
];
