import { memo, forwardRef } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref
) {
  const selectId = id ?? props.name;

  return (
    <label className="block w-full" htmlFor={selectId}>
      {label && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "w-full rounded-xl border bg-bg-elevated px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition",
          "focus:border-accent focus:ring-2 focus:ring-accent/20",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-sm text-danger" role="alert">{error}</p>}
    </label>
  );
});

export default memo(Select);
