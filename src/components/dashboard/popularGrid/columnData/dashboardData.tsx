import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { PopularProducts } from '@/common/types/popularProductTypes';
import i18n from '@/languages';
import { formatDateToMySQL } from '@/utils/dataFormat';

export const getProductColumns = (t: (key: string) => string): ColumnDef<PopularProducts>[] => {
  const isRTL = i18n.dir() === 'rtl';

  return [
    {
      accessorKey: 'name',
      header: () => t('common.product'),
      cell: ({ row }) => {
        const { name, ar_name, images } = row.original;
        const displayName = isRTL ? ar_name : name;
        const image = images && images.length > 0 ? images[0].image : '';

        return (
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-10 h-10">
              <img src={image} alt={displayName} className="w-full h-full object-cover rounded" />
            </div>
            <div className="flex-grow">
              <span>{displayName}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: () => t('common.category'),
      cell: ({ row }) => {
        const category = row.original.category;
        return <span>{category ? category.name : t('common.no_category')}</span>;
      },
    },
    {
      accessorKey: 'price',
      header: () => t('common.price'),
      cell: ({ row }) => {
        const priceStr = row.getValue('price') as string;
        const price = parseFloat(priceStr);
        return (
          <span>
            {t('common.sar')}
            {isNaN(price) ? priceStr : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: () => t('common.stock_quantity'),
      cell: ({ row }) => {
        const qtyStr = row.getValue('quantity') as string;
        const qty = parseInt(qtyStr, 10);
        return <span>{isNaN(qty) ? qtyStr : qty}</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: () => t('common.date_added'),
      cell: ({ row }) => {
        const dateValue = row.getValue('created_at');
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue as string);
        return <span>{formatDateToMySQL(date)}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: () => t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const qtyStr = row.getValue('quantity') as string;
        const qty = parseInt(qtyStr, 10);
        const colorClass =
          qty === 0 ? getStatusColorDual('out_of_stock') : getStatusColorDual(status);

        return (
          <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {qty === 0
              ? t('common.out_of_stock')
              : status === '1'
                ? t('common.status_active')
                : t('common.status_inactive')}
          </span>
        );
      },
    },
  ];
};
