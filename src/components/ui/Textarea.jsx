import { memo, forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="block w-full" htmlFor={inputId}>
      {label && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full resize-y rounded-xl border bg-bg-elevated px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition",
          "placeholder:text-text-secondary/60 focus:border-accent focus:ring-2 focus:ring-accent/20",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger" role="alert">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
    </label>
  );
});

export default memo(Textarea);
