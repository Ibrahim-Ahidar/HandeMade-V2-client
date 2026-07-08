import { memo } from "react";
import { cn } from "../../utils/cn";

function SearchBar({ value, onChange, placeholder = "Search...", className, ...props }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-bg-elevated py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
        {...props}
      />
    </div>
  );
}

export default memo(SearchBar);
