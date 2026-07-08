import { memo } from "react";
import { cn } from "../../utils/cn";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-bg-muted", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export default memo(Skeleton);
