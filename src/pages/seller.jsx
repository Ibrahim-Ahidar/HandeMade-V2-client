import { lazy, Suspense } from "react";
import { Skeleton } from "../components/ui";

const SellerDashboard = lazy(() => import("../components/features/SellerDashboard"));

function Seller() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        }
      >
        <SellerDashboard />
      </Suspense>
    </div>
  );
}

export default Seller;
