import { memo } from "react";
import { cn } from "../../utils/cn";
import { formatPrice } from "../../utils/formatPrice";
import { useI18n } from "../../context/I18nContext";

function PriceTag({ price, originalPrice, size = "md", className }) {
  const { locale } = useI18n();
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-text-primary", sizes[size])}>
        {formatPrice(price, "USD", locale)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-text-secondary line-through">
          {formatPrice(originalPrice, "USD", locale)}
        </span>
      )}
    </div>
  );
}

export default memo(PriceTag);
