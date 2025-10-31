import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';

export type Report = {
  id: string;
  customer: string;
  amount: number;
  paymentMethod: 'Credit_Card' | 'Cash' | 'PayPal';
  date: string;
  paymentStatus: 'Paid' | 'Failed' | 'Pending';
};

export const reportRows: Report[] = [
  {
    id: 'R1001',
    customer: 'Usman Farooq',
    amount: 200,
    paymentMethod: 'Cash',
    date: '2024-06-19 at 12:30 PM',
    paymentStatus: 'Paid',
  },
  {
    id: 'R1002',
    customer: 'Fatima Asif',
    amount: 310,
    paymentMethod: 'Credit_Card',
    date: '2024-06-20 at 4:45 PM',
    paymentStatus: 'Pending',
  },
  {
    id: 'R1003',
    customer: 'Ahmed Khan',
    amount: 150,
    paymentMethod: 'PayPal',
    date: '2024-06-21 at 9:15 AM',
    paymentStatus: 'Paid',
  },
  {
    id: 'R1004',
    customer: 'Sara Ali',
    amount: 425,
    paymentMethod: 'Credit_Card',
    date: '2024-06-21 at 2:20 PM',
    paymentStatus: 'Failed',
  },
  {
    id: 'R1005',
    customer: 'Mohammad_Imran',
    amount: 275,
    paymentMethod: 'Cash',
    date: '2024-06-22 at 11:00 AM',
    paymentStatus: 'Paid',
  },
  {
    id: 'R1006',
    customer: 'Zainab_Hassan',
    amount: 180,
    paymentMethod: 'PayPal',
    date: '2024-06-22 at 3:40 PM',
    paymentStatus: 'Pending',
  },
];

export const getReportColumns = (t: (key: string) => string): ColumnDef<Report>[] => [
  {
    accessorKey: 'id',
    header: t('common.id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'customer',
    header: t('common.customer'),
    cell: ({ row }) => <span>{row.getValue('customer')}</span>,
  },
  {
    accessorKey: 'amount',
    header: t('common.amount'),
    cell: ({ row }) => (
      <span>
        {t('common.sar')}
        {(row.getValue('amount') as number).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'paymentMethod',
    header: t('common.paymentMethod'),
    cell: ({ row }) => {
      const payment = (row.getValue('paymentMethod') as string)?.toLowerCase();
      return <span>{t(`common.payment_method_${payment}`)}</span>;
    },
  },
  {
    accessorKey: 'date',
    header: t('common.date'),
    cell: ({ row }) => <span>{row.getValue('date')}</span>,
  },
  {
    accessorKey: 'paymentStatus',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as string;
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {t(`common.status${status}`)}
        </span>
      );
    },
  },
];
