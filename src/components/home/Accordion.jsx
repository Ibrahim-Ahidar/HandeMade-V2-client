import { memo } from "react";
import { cn } from "../../utils/cn";
import { Card } from "../ui";

function Accordion({ items, openIndex, onToggle }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <Card key={item.q} className="overflow-hidden">
            <button
              type="button"
              className="flex w-full min-w-0 items-center justify-between gap-4 px-4 py-4 text-start text-sm font-medium text-text-primary hover:bg-bg-muted"
              onClick={() => onToggle(i)}
              aria-expanded={open}
            >
              <span className="min-w-0 flex-1 text-start">{item.q}</span>
              <span className={cn("shrink-0 text-text-secondary transition-transform duration-500", open && "rotate-180")}>
                ▼
              </span>
            </button>
            <div className={cn("accordion-panel", open ? "accordion-panel-open" : "accordion-panel-closed")}>
              <div className="overflow-hidden">
                <p className="border-t border-border px-4 py-4 text-sm leading-relaxed text-text-secondary">
                  {item.a}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default memo(Accordion);
