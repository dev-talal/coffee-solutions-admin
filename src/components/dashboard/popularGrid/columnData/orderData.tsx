import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Order, Warehouse } from '@/common/types/orderTypes';
import type { CustomerTransaction } from '@/common/types/customerTypes';
import { formatDateToMySQL } from '@/utils/dataFormat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useUpdateOrderStatusMutation } from '@/features/api/orders/ordersApi';
import { confirmModal } from '@/components/common/ConfirmAlert';
import TooltipCell from '@/components/common/TooltipCell';

export const ChangeStatusDropdownMenu = ({
  orderId,
  status,
  t,
  colorClass,
}: {
  orderId: number;
  status: string;
  t: (key: string) => string;
  colorClass: string;
}) => {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (newStatus: string) => {
    const confirmed = await confirmModal({
      title: 'Change Order Status',
      text: `Are you sure you want to set status to "${newStatus}"?`,
      confirmText: 'Yes, change it',
      cancelText: 'No',
    });
    if (confirmed) {
      updateOrderStatus({
        order_id: orderId,
        status: newStatus,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
          disabled={isLoading}
        >
          {t(`common.${status}`)}&nbsp;
          <DynamicIcon name="chevron-down" className="w-3 h-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {['pending', 'dispatched', 'delivered', 'cancelled'].map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)}>
            {t(`common.${s}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getOrderColumns = (t: (key: string) => string): ColumnDef<Order>[] => [
  {
    accessorKey: 'id',
    header: t('common.order_id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'user',
    header: t('common.user'),
    cell: ({ row }) => {
      const user = row.getValue('user') as CustomerTransaction;
      if (!user) {
        return (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-gray-400">{t('common.undefined_user')}</div>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <TooltipCell value={user.first_name + ' ' + user.last_name} />
          <div className="text-xs">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'total_amount',
    header: t('common.amount'),
    cell: ({ row }) => (
      <span>
        {t('common.sar')}
        {row.getValue('total_amount') as number}{' '}
      </span>
    ),
  },
  {
    accessorKey: 'payment_method',
    header: t('common.paymentMethod'),
    cell: ({ row }) => {
      const payment = row.getValue('payment_method') as string;
      return <span>{t(`${payment}`)}</span>;
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
    accessorKey: 'warehouse',
    header: t('common.warehouse'),
    cell: ({ row }) => {
      const warehouse = row.getValue('warehouse') as Warehouse;
      return <span>{warehouse.name}</span>;
    },
  },
  {
    accessorKey: 'driver',
    header: t('common.driver'),
    cell: ({ row }) => {
      const driver = row.getValue('driver') as Order['driver'];
      if (!driver) {
        return (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-gray-400">N/A</div>
          </div>
        );
      }
      return (
        <span className="font-medium text-sm">
          {driver.first_name} {driver.last_name}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const orderId = row.getValue('id') as number;
      const colorClass = getStatusColorDual(status);

      return status !== 'cancelled' ? (
        <ChangeStatusDropdownMenu orderId={orderId} status={status} t={t} colorClass={colorClass} />
      ) : (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {t(`common.${status}`)}
        </span>
      );
    },
  },
];
