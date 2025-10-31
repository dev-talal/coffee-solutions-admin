import type { Role } from '@/common/types/roleType';
import type { ColumnDef } from '@tanstack/react-table';

export const getRolesColumns = (t: (key: string) => string): ColumnDef<Role>[] => [
  {
    accessorKey: 'name',
    header: t('common.role'),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'description',
    header: t('common.description'),
  },
];
