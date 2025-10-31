import { Suspense } from 'react';

interface StepWrapperProps {
  isDataReady: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const StepWrapper = ({ isDataReady, fallback, children }: StepWrapperProps) => {
  if (!isDataReady) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
