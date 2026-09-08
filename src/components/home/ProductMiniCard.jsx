import { memo } from "react";
import { cn } from "../../utils/cn";
import { Card, PriceTag, Badge } from "../ui";

function ProductMiniCard({ product, recency, className }) {
  const image = product?.images?.[0];

  return (
    <Card className={cn("flex min-w-0 items-center gap-3 p-4", className)}>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bg-muted">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{product.name}</p>
        <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />
        {recency ? (
          <p className="mt-2 text-xs text-text-secondary">{recency}</p>
        ) : null}
      </div>
      {product.featured ? (
        <Badge variant="accent" className="shrink-0">
          ★
        </Badge>
      ) : null}
    </Card>
  );
}

export default memo(ProductMiniCard);
