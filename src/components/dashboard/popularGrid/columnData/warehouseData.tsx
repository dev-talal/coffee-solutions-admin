import type { i18n as I18nType } from 'i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Warehouse } from '@/common/types/warehouseTypes';
import { ListWithPopover } from '@/components/common/ListWithPopover';

export const getWarehouseColumns = (
  t: (key: string) => string,
  i18n: I18nType,
): ColumnDef<Warehouse>[] => [
  {
    accessorKey: 'id',
    header: t('common.warehouse_id'),
  },
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) => {
      const isRTL = i18n?.dir() === 'rtl';
      const warehouse = row.original;
      const displayName = isRTL ? warehouse.ar_name : warehouse.name;
      return <span>{displayName}</span>;
    },
  },
  {
    accessorKey: 'region',
    header: t('common.regions'),
    cell: ({ row }) => {
      const isRTL = i18n?.dir() === 'rtl';
      const data = row.original;
      if (!data.regions?.length) return <span>N/A</span>;
      return (
        <ListWithPopover
          items={data.regions}
          maxVisible={1}
          title={t('common.warehouses')}
          renderItem={(region) => (
            <span
              key={region.id}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {isRTL ? region.ar_name : region.name}
            </span>
          )}
        />
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: t('common.date'),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <time>{new Date(date).toLocaleDateString()}</time>;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Warehouse['status'];
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.status_active') : t('common.status_inactive')}
        </span>
      );
    },
  },
];
