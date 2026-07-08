import { memo, forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(function Input(
  { label, error, hint, compact = false, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="block w-full" htmlFor={inputId}>
      {label && (
        <span
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider text-text-secondary",
            compact ? "mb-1" : "mb-2"
          )}
        >
          {label}
        </span>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(
          "w-full rounded-xl border bg-bg-elevated px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition",
          "placeholder:text-text-secondary/60 focus:border-accent focus:ring-2 focus:ring-accent/20",
          error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className={cn("text-danger", compact ? "mt-1 text-xs" : "mt-1.5 text-sm")} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-text-secondary">
          {hint}
        </p>
      )}
    </label>
  );
});

export default memo(Input);
