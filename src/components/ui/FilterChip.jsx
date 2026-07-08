import { memo } from "react";
import { cn } from "../../utils/cn";

function FilterChip({ label, active, onClick, onRemove, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-bg-elevated text-text-secondary hover:border-accent/30 hover:text-text-primary",
        className
      )}
    >
      {label}
      {active && onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => e.key === "Enter" && onRemove()}
          className="ml-0.5 hover:text-danger"
          aria-label={`Remove ${label} filter`}
        >
          ×
        </span>
      )}
    </button>
  );
}

export default memo(FilterChip);
