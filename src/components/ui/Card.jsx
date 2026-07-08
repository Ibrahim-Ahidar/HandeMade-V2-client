import { memo } from "react";
import { cn } from "../../utils/cn";

function Card({ children, className, as, ...props }) {
  const Element = as || "div";
  return (
    <Element
      className={cn(
        "rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]",
        className
      )}
      {...props}
    >
      {children}
    </Element>
  );
}

export default memo(Card);
