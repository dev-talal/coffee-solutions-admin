import type { ColumnDef } from '@tanstack/react-table';
import type { Customer } from '@/common/types/customerTypes';
import TooltipCell from '@/components/common/TooltipCell';

export const getCustomerColumns = (t: (key: string) => string): ColumnDef<Customer>[] => [
  {
    accessorKey: 'id',
    header: t('common.id'),
    cell: ({ row }) => <span>{row.original.customer_code || 'N/A'}</span>,
  },
  {
    accessorKey: 'name',
    header: t('common.first_name'),
    cell: ({ row }) => <TooltipCell value={row.original.first_name} />,
  },
  {
    accessorKey: 'last_name',
    header: t('common.last_name'),
    cell: ({ row }) => <TooltipCell value={row.original.last_name} />,
  },
  {
    accessorKey: 'email',
    header: t('common.email'),
    cell: ({ row }) => <TooltipCell value={row.original.email} />,
  },
  {
    accessorKey: 'phone',
    header: t('common.phoneNumber'),
    cell: ({ row }) => <span>{row.getValue('phone') || 'N/A'}</span>,
  },
  {
    accessorKey: 'registration_number',
    header: t('common.registrationNumber'),
    cell: ({ row }) => <span>{row.getValue('registration_number') || 'N/A'}</span>,
  },
  {
    accessorKey: 'vat_number',
    header: t('common.vatNumber'),
    cell: ({ row }) => <span>{row.getValue('vat_number') || 'N/A'}</span>,
  },
  {
    accessorKey: 'region',
    header: t('common.region'),
    cell: ({ row }) => <TooltipCell value={row.original.region?.name} />,
  },
  {
    accessorKey: 'city',
    header: t('common.city'),
    cell: ({ row }) => <TooltipCell value={row.original.city?.name} />,
  },
  {
    accessorKey: 'warehouse',
    header: t('common.warehouse'),
    cell: ({ row }) => <TooltipCell value={row.original.warehouse?.name} />,
  },
  {
    accessorKey: 'credit_limit',
    header: t('common.creditLimit'),
    cell: ({ row }) => (
      <span>
        {t('common.sar')}
        {row.getValue('credit_limit')}
      </span>
    ),
  },
];
