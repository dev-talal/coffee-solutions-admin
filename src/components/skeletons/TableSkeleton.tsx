import { Skeleton } from '@/components/ui/skeleton';

const SkeletonLoader = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-1/3 rounded-md skeleton-shimmer" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-md skeleton-shimmer" />
          <Skeleton className="h-10 w-32 rounded-md skeleton-shimmer" />
          <Skeleton className="h-10 w-32 rounded-md skeleton-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <Skeleton className="h-12 w-full rounded-md skeleton-shimmer" />
      </div>

      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-4">
            <Skeleton className="h-10 w-full rounded-md skeleton-shimmer" />
            <Skeleton className="h-10 w-full rounded-md skeleton-shimmer" />
            <Skeleton className="h-10 w-full rounded-md skeleton-shimmer" />
            <Skeleton className="h-10 w-full rounded-md skeleton-shimmer" />
            <Skeleton className="h-10 w-full rounded-md skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
