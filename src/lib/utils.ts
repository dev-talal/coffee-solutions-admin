import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SalesData {
  date: string;
  total_sales: number;
}

export const fillMissingDates = (
  data: { date: string; total_sales: string | number }[],
  from: Date,
  to: Date,
): SalesData[] => {
  const map = new Map(data.map((d) => [d.date, Number(d.total_sales)]));
  const result: SalesData[] = [];

  const cur = new Date(from.getTime());

  while (cur <= to) {
    const key = format(cur, 'yyyy-MM-dd');
    result.push({
      date: key,
      total_sales: map.get(key) ?? 0,
    });

    cur.setDate(cur.getDate() + 1);
  }

  return result;
};
