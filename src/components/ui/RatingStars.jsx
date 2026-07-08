import { memo } from "react";
import { cn } from "../../utils/cn";

function RatingStars({ rating, reviewCount, size = "sm", className }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));

  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`${rating} out of 5 stars`}>
      <div className="flex text-accent-warm">
        {stars.map((filled, i) => (
          <span key={i} className={size === "lg" ? "text-lg" : "text-sm"}>
            {filled ? "★" : "☆"}
          </span>
        ))}
      </div>
      {reviewCount != null && (
        <span className="text-xs text-text-secondary">({reviewCount})</span>
      )}
    </div>
  );
}

export default memo(RatingStars);
