import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Driver } from '@/common/types/driverTypes';
import { ListWithPopover } from '@/components/common/ListWithPopover';

export const getDriversColumns = (t: (key: string) => string): ColumnDef<Driver>[] => [
  {
    accessorKey: 'id',
    header: t('common.driver_id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'name',
    header: t('common.driver_name'),
    cell: ({ row }) => {
      const driver = row.original;
      const first_name = driver.first_name;
      const last_name = driver.last_name;
      return (
        <div>
          {first_name} {last_name}
        </div>
      );
    },
  },
  {
    accessorKey: 'mobile_no',
    header: t('common.phoneNumber'),
    cell: ({ row }) => <span>{row.getValue('mobile_no') || 'N/A'}</span>,
  },
  {
    accessorKey: 'warehouses',
    header: t('common.warehouses'),
    cell: ({ row }) => {
      const driver = row.original;
      if (!driver.warehouses?.length) return <span>N/A</span>;

      return (
        <ListWithPopover
          items={driver.warehouses}
          maxVisible={1}
          title={t('common.warehouses')}
          renderItem={(warehouse) => (
            <span
              key={warehouse.id}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {warehouse.name}
            </span>
          )}
        />
      );
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Driver['status'];
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.status_active') : t('common.status_inactive')}
        </span>
      );
    },
  },
];
