import { memo, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";

function Drawer({ open, onClose, title, children, side = "left", className }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  const sideClass =
    side === "right"
      ? "right-0 animate-[slide-in-right_250ms_ease-out]"
      : "left-0 animate-[slide-in-left_250ms_ease-out]";

  return (
    <div className="fixed inset-0 z-[10000]" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <aside
        className={cn(
          "absolute top-0 h-full w-[min(100%,20rem)] border-border bg-bg-elevated shadow-[var(--shadow-elevated)]",
          side === "right" ? "border-l" : "border-r",
          sideClass,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-text-secondary hover:bg-bg-muted"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}

export default memo(Drawer);
