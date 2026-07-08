import { memo } from "react";
import { Skeleton } from "../ui";

function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated">
      <Skeleton className="aspect-square w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-2 hidden h-10 w-full sm:block" />
        <div className="mt-3 flex min-h-8 items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-3 flex min-h-6 items-end justify-between gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="mt-auto pt-4">
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCardSkeleton);
