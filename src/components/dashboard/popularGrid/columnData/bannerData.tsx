import type { ColumnDef } from '@tanstack/react-table';
import type { Banner } from '@/common/types/bannerTypes';

export const getBannersColumns = (t: (key: string) => string): ColumnDef<Banner>[] => [
  {
    accessorKey: 'id',
    header: t('common.banner_id'),
    cell: ({ row }) => <span>{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'url',
    header: t('common.image'),
    cell: ({ row }) => {
      const image = row.getValue('url') as string;
      return (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10">
            <img src={image} alt={image} className="w-full h-full object-cover rounded" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: t('common.type'),
    cell: ({ row }) => <span>{row.getValue('type')}</span>,
  },
  {
    accessorKey: 'category',
    header: t('common.category'),
    cell: ({ row }) => {
      const category = row.getValue('category') as Banner['category'];
      return <span className="text-capitalize">{category?.name}</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: t('common.created_at'),
    cell: ({ row }) => <span>{row.getValue('created_at')}</span>,
  },
];
