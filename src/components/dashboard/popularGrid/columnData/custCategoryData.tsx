import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { CustomerCategory } from '@/common/types/customerCategoryTypes';

export const getCustCategoryColumns = (
  t: (key: string) => string,
): ColumnDef<CustomerCategory>[] => [
  {
    accessorKey: 'id',
    header: t('common.id'),
    cell: ({ row }) => <div className="text-xs text-amber-400">{row.original.id}</div>,
  },
  {
    accessorKey: 'name',
    header: t('common.category'),
    cell: ({ row }) => {
      const Name = row.getValue('name') as string;
      const colorClass = getStatusColorDual(Name);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{Name}</span>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: t('common.discount'),
    cell: ({ row }) => {
      return <span>{row.getValue('discount')}%</span>;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorClass = getStatusColorDual(status.toString());
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.active') : t('common.inactive')}
        </span>
      );
    },
  },
];
