import type { ColumnDef } from '@tanstack/react-table';

export type RoleDetail = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export const roleDetailsRow: RoleDetail[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all system features',
    permissions: ['manage_users', 'view_reports', 'edit_settings'],
  },
  {
    id: '2',
    name: 'Zubair',
    description: 'Manage operations and view analytics',
    permissions: ['view_reports', 'manage_orders'],
  },
];

export const getRoleDetailsColumns = (t: (key: string) => string): ColumnDef<RoleDetail>[] => [
  {
    accessorKey: 'name',
    header: t('common.user'),
  },
  {
    accessorKey: 'description',
    header: t('common.description'),
  },
  {
    accessorKey: 'permissions',
    header: t('common.permissions'),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.permissions.map((perm) => (
          <span key={perm} className="bg-gray-200 dark:bg-black text-xs px-2 py-1 rounded">
            {perm}
          </span>
        ))}
      </div>
    ),
  },
];
