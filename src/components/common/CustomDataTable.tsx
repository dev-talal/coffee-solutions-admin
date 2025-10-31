import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '../ui/checkbox';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import SkeletonLoader from '../skeletons/TableSkeleton';
import type { PaginatedResponse } from '@/common/types/commonTypes';
import { useTranslation } from 'react-i18next';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { ButtonConfig } from './CustomFilterButtons';
import RenderButton from './CustomFilterButtons';

type ActionProps<T> = {
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showTransfer?: boolean;
  showDispatch?: boolean;
  showOrder?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onTransfer?: (row: T) => void;
  onDispatch?: (row: T) => void;
  onOrder?: (row: T) => void;
};

interface CustomDataTableProps<TData> {
  data: TData[];
  pagination?: PaginatedResponse<TData>['meta'];
  onPageChange?: (page: number) => void;
  columns: ColumnDef<TData>[];
  filterColumn?: keyof TData;
  actions?: ActionProps<TData>;
  enableRowSelection?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  Button4?: ButtonConfig;
  Button1?: ButtonConfig;
  Button2?: ButtonConfig;
  Button3?: ButtonConfig;
  showFilterBar?: boolean;
  pageSize?: number;
  filterBarNames?: string[];
  loading?: boolean;
  searchAction?: {
    onChange: (value: string) => void;
    value: string;
    loading?: boolean;
  };
}

export function CustomDataTable<TData>({
  data,
  columns,
  filterColumn,
  actions,
  enableRowSelection = false,
  showSearch = true,
  searchPlaceholder,
  Button4,
  Button1,
  Button2,
  Button3,
  showFilterBar = false,
  filterBarNames = ['All', 'All', 'All'],
  loading = false,
  pagination,
  searchAction,
  onPageChange,
}: CustomDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [activeFilter, setActiveFilter] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection,
  });

  const hasActions =
    actions?.showView ||
    actions?.showEdit ||
    actions?.showDelete ||
    actions?.showTransfer ||
    actions?.showDispatch ||
    actions?.showOrder;

  const shouldShowToolbar =
    showSearch || Button4?.show || Button1?.show || Button2?.show || Button3?.show;

  React.useEffect(() => {
    if (pagination?.per_page) setPageSize(pagination?.per_page ?? 10);
  }, [pagination]);

  React.useEffect(() => {
    if (searchAction?.value) setSearchLoading(true);
    else setSearchLoading(false);
  }, [searchAction?.value]);

  React.useEffect(() => {
    if (!searchAction?.loading) {
      setSearchLoading(false);
    }
  }, [searchAction?.loading]);

  const { t } = useTranslation();

  return !loading ? (
    <>
      <div className="w-full">
        {shouldShowToolbar && (
          <div className="flex flex-wrap items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3 flex-1 h-[40px]">
              {showSearch && searchAction && (
                <div
                  className="relative w-full max-w-lg h-full 
              drop-shadow-sm"
                >
                  <Input
                    placeholder={searchPlaceholder || `Search ${filterColumn as string}...`}
                    value={searchAction?.value || ''}
                    onChange={(e) => searchAction?.onChange(e.target.value)}
                    className={cn(
                      'w-full h-full rounded-full font-medium text-[16px] bg-card',
                      document?.documentElement?.dir === 'rtl' ? 'pr-4 pl-10' : 'pl-4 pr-10',
                    )}
                  />
                  {!searchLoading ? (
                    <DynamicIcon
                      name="search"
                      className={cn(
                        'absolute top-1/2 transform -translate-y-1/2 drop-shadow-sm text-muted-foreground h-5 w-5 ',
                        document?.documentElement?.dir === 'rtl' ? 'left-3 rotate-90' : 'right-3',
                      )}
                    />
                  ) : (
                    <DynamicIcon
                      name="loader-2"
                      className={cn(
                        'absolute top-1/2 transform -translate-y-1/2 drop-shadow-sm text-muted-foreground h-5 w-5 animate-spin',
                        document?.documentElement?.dir === 'rtl' ? 'left-3' : 'right-3',
                      )}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
              {RenderButton(Button1)}
              {RenderButton(Button2)}
              {RenderButton(Button3)}
              {RenderButton(Button4)}
            </div>
          </div>
        )}
        {showFilterBar && (
          <div
            className="grid items-center bg-card border py-2 px-2 rounded-md sm:rounded-full mb-4 gap-x-2 
              drop-shadow-sm"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            }}
          >
            {filterBarNames.map((filterName, index) => {
              const isActive = activeFilter === index;
              const buttonClasses = `
              h-[36px]
              text-sm 
              font-bold 
              rounded-md sm:rounded-full
              border-none 
              hover:bg-custom-beige 
              dark:hover:text-black
              dark:hover:bg-custom-beige
              dark:text-white
              drop-shadow-sm
              ${isActive ? 'bg-custom-beige text-black dark:text-black' : 'bg-transparent text-black'}
            `;

              return (
                <Button
                  key={index}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => setActiveFilter(index)}
                  className={buttonClasses}
                >
                  {filterName}
                </Button>
              );
            })}
          </div>
        )}

        <div className="rounded-md border overflow-hidden">
          <Table className="bg-card table-fixed w-full">
            <TableHeader className="bg-accent text-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {enableRowSelection && (
                    <TableHead className=" px-4 py-2 w-[50px]">
                      <div
                        className={cn(
                          'h-full flex items-center',
                          document?.documentElement?.dir === 'rtl'
                            ? 'justify-end pr-4'
                            : 'justify-start  pl-3',
                        )}
                      >
                        <Checkbox
                          className="border-sidebar-ring rounded-3"
                          checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                          }
                          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                          aria-label="Select all"
                        />
                      </div>
                    </TableHead>
                  )}

                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    const dir = document?.documentElement?.dir;
                    const borderDirClass = dir === 'rtl' ? 'border-l pl-3' : 'border-r pr-3';

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          'w-[220px] px-4 py-2',
                          canSort && 'select-none',
                          isSorted === 'asc' && 'text-accent',
                          isSorted === 'desc' && 'text-accent-foreground',
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center gap-1 justify-between',
                            canSort && 'select-none',
                            borderDirClass,
                            isSorted && 'text-accent-foreground',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Button
                            className={cn(
                              'flex hover:bg-card items-center bg-transparent text-foreground shadow-none p-1 size-7',
                              isSorted && 'bg-card',
                            )}
                            onClick={() => {
                              if (canSort) {
                                header.column.toggleSorting(isSorted === 'asc');
                              }
                            }}
                          >
                            {canSort &&
                              (isSorted === 'asc' ? (
                                <DynamicIcon
                                  name="arrow-up"
                                  className="h-4 w-4 text-muted-foreground"
                                />
                              ) : isSorted === 'desc' ? (
                                <DynamicIcon
                                  name="arrow-down"
                                  className="h-4 w-4 text-muted-foreground"
                                />
                              ) : (
                                <DynamicIcon
                                  name="arrow-up-down"
                                  className="h-4 w-4 text-muted-foreground"
                                />
                              ))}
                          </Button>
                        </div>
                      </TableHead>
                    );
                  })}

                  {hasActions && (
                    <TableHead
                      className={cn(
                        'px-4 w-[200px]',
                        document?.documentElement?.dir === 'rtl'
                          ? 'border-l text-right pr-6'
                          : 'border-r text-left pl-6',
                      )}
                    >
                      {t('common.actions')}
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {enableRowSelection && (
                      <TableCell
                        className={cn(
                          'w-[50px]',
                          document?.documentElement?.dir === 'rtl'
                            ? 'pr-4 pl-0 text-center'
                            : 'pl-7 pr-0 text-left',
                        )}
                      >
                        <Checkbox
                          className="border-sidebar-ring  rounded-3"
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) => row.toggleSelected(!!value)}
                          aria-label="Select row"
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => {
                      const value = cell.getValue();
                      const isLongString = typeof value === 'string' && value.length > 20;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'px-4 mx-4',
                            cell.column.id === 'name' &&
                              isLongString &&
                              'line-clamp-1 w-[120px] px-4 mx-0 ',
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}

                    {hasActions && (
                      <TableCell className="space-x-1 px-4">
                        {actions?.showOrder && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onOrder?.(row.original)}
                          >
                            <DynamicIcon
                              name="shopping-cart"
                              className="w-6 h-6 text-muted-foreground group-hover:text-amber-800"
                            />
                          </Button>
                        )}
                        {actions?.showView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onView?.(row.original)}
                          >
                            <DynamicIcon
                              name="eye"
                              className="w-6 h-6 text-muted-foreground group-hover:text-foreground"
                            />
                          </Button>
                        )}
                        {actions?.showEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onEdit?.(row.original)}
                          >
                            <DynamicIcon
                              name="square-pen"
                              className="w-6 h-6 text-muted-foreground group-hover:text-blue-800"
                            />
                          </Button>
                        )}
                        {actions?.showDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onDelete?.(row.original)}
                          >
                            <DynamicIcon
                              name="trash-2"
                              className="w-6 h-6 text-muted-foreground group-hover:text-red-800"
                            />
                          </Button>
                        )}
                        {actions?.showTransfer && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onTransfer?.(row.original)}
                          >
                            <DynamicIcon
                              name="warehouse"
                              className="w-6 h-6 text-muted-foreground group-hover:text-blue-800"
                            />
                          </Button>
                        )}
                        {actions?.showDispatch && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="group"
                            onClick={() => actions.onDispatch?.(row.original)}
                          >
                            <DynamicIcon
                              name="truck"
                              className="w-6 h-6 text-muted-foreground group-hover:text-green-800"
                            />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    {t('common.no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 py-4">
          <div className="flex flex-col items-start gap-2">
            {enableRowSelection && (
              <div className="text-muted-foreground text-sm">
                {table.getFilteredSelectedRowModel().rows.length} {t('common.of')}{' '}
                {table.getFilteredRowModel().rows.length} {t('common.rows')}
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            {pagination && (
              <Pagination>
                <PaginationContent className="flex gap-2">
                  {/* Previous Button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => onPageChange?.((pagination?.current_page ?? 1) - 1)}
                      disabled={(pagination?.current_page ?? 1) <= 1}
                      className={cn(
                        'rounded-md bg-card',
                        (pagination?.current_page ?? 1) <= 1 &&
                          'opacity-50 pointer-events-none cursor-not-allowed',
                      )}
                    >
                      <DynamicIcon name="chevrons-left" className="w-3 h-3 rtl:rotate-180" />
                    </Button>
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination?.last_page ?? 1 }, (_, index) => (
                    <PaginationItem key={index}>
                      <Button
                        variant={
                          (pagination?.current_page ?? 1) === index + 1 ? 'default' : 'outline'
                        }
                        onClick={() => onPageChange?.(index + 1)}
                        className={cn(
                          'px-4 py-2 text-sm rounded-md hover:bg-amber-500 text-black dark:text-foreground',
                          (pagination?.current_page ?? 1) === index + 1 ? 'bg-chart-1' : '',
                        )}
                      >
                        {index + 1}
                      </Button>
                    </PaginationItem>
                  ))}

                  {/* Next Button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      onClick={() => onPageChange?.((pagination?.current_page || 1) + 1)}
                      disabled={(pagination?.current_page ?? 1) >= (pagination?.last_page || 1)}
                      className={cn(
                        'rounded-md bg-card',
                        (pagination?.current_page ?? 1) >= (pagination?.last_page || 1) &&
                          'opacity-50 pointer-events-none cursor-not-allowed',
                      )}
                    >
                      <DynamicIcon name="chevrons-right" className="w-3 h-3 rtl:rotate-180" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <SkeletonLoader />
  );
}
