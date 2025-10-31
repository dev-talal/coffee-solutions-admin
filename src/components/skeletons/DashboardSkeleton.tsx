import { Skeleton } from '@/components/ui/skeleton';

export const DashboardCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-56 w-full rounded-xl skeleton-shimmer" />
    ))}
  </div>
);

export const DashboardSalesSkeleton = () => {
  return <Skeleton className="h-100 w-full rounded-xl skeleton-shimmer" />;
};

export const DashboardPerformanceSkeleton = () => {
  return <Skeleton className="h-100 w-full rounded-xl skeleton-shimmer" />;
};

export const DashboardProductsSkeleton = () => {
  return (
    <div className="col-span-12 mt-3">
      <Skeleton className="h-100 w-full rounded-xl skeleton-shimmer" />
    </div>
  );
};
