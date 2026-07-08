import { memo } from "react";
import { cn } from "../../utils/cn";
import { formatPrice } from "../../utils/formatPrice";

function PriceTag({ price, originalPrice, size = "md", className }) {
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-text-primary", sizes[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-text-secondary line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

export default memo(PriceTag);
