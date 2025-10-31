import type { ColumnDef } from '@tanstack/react-table';
import type { Staff } from '@/common/types/staffTypes';

export const getStaffColumns = (t: (key: string) => string): ColumnDef<Staff>[] => [
  {
    accessorKey: 'first_name',
    header: t('common.name'),
    cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium">
          {row.original.first_name}&nbsp;{row.original.last_name}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: t('common.email'),
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: 'role',
    header: t('common.role'),
    cell: ({ row }) => <span>{row.original.role}</span>,
  },
];
