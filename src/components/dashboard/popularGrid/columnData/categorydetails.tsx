import type { ColumnDef } from '@tanstack/react-table';

export type CategoryDetails = {
  id: string;
  name: string;
  email: string;
};

export const categoryDetailsRows: CategoryDetails[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Alice Brown', email: 'alice@example.com' },
  { id: '4', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com' },
  { id: '6', name: 'Dave Thomas', email: 'dave@example.com' },
  { id: '7', name: 'Eve Brown', email: 'eve@example.com' },
];

export const categoryDetailsColumns: ColumnDef<CategoryDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Customer Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
