import type { ColumnDef } from '@tanstack/react-table';
import { getStatusColorDual } from '@/helpers/colorStatus';
import type { Product } from '@/common/types/productCategoryTypes';
import type { i18n as I18nType } from 'i18next';

export const getProductsCategoryColumns = (
  t: (key: string) => string,
  i18n: I18nType,
): ColumnDef<Product>[] => [
  {
    accessorKey: 'id',
    header: t('common.id'),
    cell: ({ row }) => <div className="text-lg text-amber-400">{row.original.id}</div>,
  },
  {
    accessorKey: 'name',
    header: t('common.category'),
    cell: ({ row }) => {
      const category = row.original;
      const isRTL = i18n?.dir() === 'rtl';
      const name = isRTL ? category.ar_name : category.name;
      return <span className="py-1 rounded-full text-sm ">{name}</span>;
    },
  },
  {
    accessorKey: 'parent',
    header: t('common.parent') + ' ' + t('common.category'),
    cell: ({ row }) => {
      const parent = row.original.parent;
      if (!parent) return <span>N/A</span>;

      const isRTL = i18n?.dir() === 'rtl';
      const name = isRTL ? parent.ar_name : parent.name;

      return <span>{name}</span>;
    },
  },
  {
    accessorKey: 'icon',
    header: t('common.icon'),
    cell: ({ row }) => {
      const Icon = row.getValue('icon') as string;
      return (
        <span>
          <img
            loading="lazy"
            src={Icon}
            alt="icon"
            className="w-10 h-10 rounded-full border object-cover"
          />
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorClass = getStatusColorDual(status.toString());
      return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {status == '1' ? t('common.active') : t('common.inactive')}
        </span>
      );
    },
  },
];
