import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse-fast rounded-xl bg-sand-200/60 dark:bg-espresso/20 perf-gpu",
        className
      )}
      {...props}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="card-minimal p-4 space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-1/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
