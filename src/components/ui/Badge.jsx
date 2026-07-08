import { memo } from "react";
import { cn } from "../../utils/cn";

const variants = {
  default: "bg-bg-muted text-text-primary border-border",
  accent: "bg-accent/10 text-accent border-accent/20",
  warm: "bg-accent-warm/15 text-accent-warm border-accent-warm/25",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
};

function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant] ?? variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export default memo(Badge);
