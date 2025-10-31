import { useNavigate } from 'react-router';
import { useState } from 'react';
import { CustomDataTable } from '@/components/common/CustomDataTable';
import { getOrderColumns } from '@/components/dashboard/popularGrid/columnData/orderData';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/common/types/orderTypes';
import { useOrdersQuery } from '@/features/api/orders/ordersApi';
import TransferOrders from '@/components/forms/orders/TransferOrders';
import DispatchOrders from '@/components/forms/orders/DispatchOrders';

export default function OrderGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const columns = getOrderColumns(t);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useOrdersQuery(
    { page },
    { refetchOnMountOrArgChange: true },
  );

  const handleView = (row: Order) => {
    navigate(`/order/details/${row.id}`);
  };

  const handleTransfer = (row: Order) => {
    setSelectedOrder(row);
    setTransferDialogOpen(true);
  };

  const handleDispatch = (row: Order) => {
    setSelectedOrder(row);
    setDispatchDialogOpen(true);
  };

  return (
    <>
      <CustomDataTable<Order>
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        {...(data?.meta && {
          pagination: data.meta,
          onPageChange: setPage,
        })}
        showFilterBar
        filterBarNames={[t('common.all_orders'), t('common.completed'), t('common.cancelled')]}
        filterColumn="id"
        enableRowSelection
        searchPlaceholder={t('common.search_order')}
        showSearch={false}
        Button1={{
          show: true,
          label: t('common.filter_by_date'),
          buttonType: 'date',
          onDateChange: (range) => {
            console.log('Selected date range:', range);
          },
        }}
        Button2={{
          show: true,
          label: t('common.filter_by_price'),
          buttonType: 'price',
          onPriceChange: (range) => {
            console.log('Selected price range:', range);
          },
        }}
        actions={{
          showView: true,
          showTransfer: true,
          showDispatch: true,
          onView: handleView,
          onTransfer: handleTransfer,
          onDispatch: handleDispatch,
        }}
      />

      {dispatchDialogOpen && (
        <DispatchOrders
          open={dispatchDialogOpen}
          onOpenChange={setDispatchDialogOpen}
          order={selectedOrder}
          onSuccess={() => refetch()}
        />
      )}

      {transferDialogOpen && (
        <TransferOrders
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          order_id={selectedOrder?.id ?? 0}
          transfer_to={selectedOrder?.warehouse?.id ?? 0}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}
