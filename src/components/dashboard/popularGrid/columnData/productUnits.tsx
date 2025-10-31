import type { i18n as I18nType } from 'i18next';
import type { ProductUnit } from '@/common/types/productTypes';
import TooltipCell from '@/components/common/TooltipCell';
import type { ColumnDef } from '@tanstack/react-table';

export const getProductUnitsColumns = (
  t: (key: string) => string,
  i18n: I18nType,
): ColumnDef<ProductUnit>[] => [
  {
    accessorKey: 'id',
    header: t('common.id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) => {
      const isRTL = i18n?.dir() === 'rtl';
      const unit = row.original;
      const displayName = isRTL ? unit.ar_name : unit.name;
      return <TooltipCell value={displayName} />;
    },
  },
];
