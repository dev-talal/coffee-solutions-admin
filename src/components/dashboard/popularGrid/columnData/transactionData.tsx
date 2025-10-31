import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Transactions } from '@/common/types/transactionType';
import { formatDateToMySQL } from '@/utils/dataFormat';
import type { Customer } from '@/common/types/customerTypes';

export const getTransactionColumns = (t: (key: string) => string): ColumnDef<Transactions>[] => [
  {
    accessorKey: 'id',
    header: t('common.transaction_id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'customer',
    header: t('common.user'),
    cell: ({ row }) => {
      const customer = row.getValue('customer') as Customer;
      if (!customer) {
        return (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-gray-400">{t('common.undefined_user')}</div>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm">
            {customer.first_name} {customer.last_name}
          </div>
          <div className="text-xs">{customer.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: t('common.amount'),
    cell: ({ row }) => (
      <span>
        {t('common.sar')}
        {row.getValue('amount') as number}{' '}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: t('common.paymentType'),
    cell: ({ row }) => {
      const type = (row.getValue('type') as string)?.toLowerCase();
      const colorClass = getStatusColorDual(type);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {t(`common.${type}`)}
        </span>
      );
    },
  },
  {
    accessorKey: 'method',
    header: t('common.paymentMethod'),
    cell: ({ row }) => {
      const payment = (row.getValue('method') as string)?.toLowerCase();
      return <span>{t(`common.${payment}`)}</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: t('common.date'),
    cell: ({ row }) => {
      const dateValue = row.getValue('created_at');
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue as string);
      return <span>{formatDateToMySQL(date)}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.payment_status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {t(`common.${status}`)}
        </span>
      );
    },
  },
];
