import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Promotion } from '@/common/types/promotionTypes';
import { formatStringToDateTime } from '@/helpers/dataFormat';
import type { i18n as I18nType } from 'i18next';

export const getPromotionColumns = (
  t: (key: string) => string,
  i18n: I18nType,
): ColumnDef<Promotion>[] => [
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) => {
      const isRTL = i18n?.dir() === 'rtl';
      const promotion = row.original;
      const displayName = isRTL ? promotion.ar_name : promotion.name;
      const image = promotion.images?.length > 0 ? promotion.images[0].image : '';
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
    accessorKey: 'price',
    header: t('common.price'),
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return (
        <span>
          {t('common.sar')}
          {Number(price).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: t('common.stock_quantity'),
    cell: ({ row }) => {
      const qty = row.getValue('quantity') as number;
      return <span>{qty}</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: t('common.date_added'),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <span>{formatStringToDateTime(date)}</span>;
    },
  },
  {
    accessorKey: 'promotion_end_date',
    header: t('common.expiry_date'),
    cell: ({ row }) => {
      const date = row.getValue('promotion_end_date') as string;
      return <span>{formatStringToDateTime(date)}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as Promotion['status'];
      const colorClass = getStatusColorDual(status);
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.status_active') : t('common.status_inactive')}
        </span>
      );
    },
  },
];
