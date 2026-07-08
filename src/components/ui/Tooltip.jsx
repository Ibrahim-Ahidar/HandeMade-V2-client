import { memo } from "react";
import { cn } from "../../utils/cn";

function Tooltip({ children, content, className }) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-bg-elevated px-2.5 py-1.5 text-xs text-text-primary opacity-0 shadow-[var(--shadow-soft)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}

export default memo(Tooltip);
