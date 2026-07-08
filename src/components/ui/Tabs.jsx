import { memo } from "react";
import { cn } from "../../utils/cn";

function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn("flex gap-1 rounded-xl border border-border bg-bg-muted p-1", className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition",
            active === tab.id
              ? "bg-bg-elevated text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default memo(Tabs);
