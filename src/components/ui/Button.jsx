import { memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-accent text-white shadow-sm hover:bg-accent-hover active:scale-[0.98] focus-visible:ring-accent/40",
  secondary:
    "bg-bg-muted text-text-primary border border-border hover:bg-bg-elevated active:scale-[0.98]",
  ghost: "bg-transparent text-text-primary hover:bg-bg-muted",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-accent/40 hover:bg-bg-muted",
  warm: "bg-accent-warm text-white hover:brightness-105 active:scale-[0.98]",
  danger: "bg-danger text-white hover:brightness-110 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-sm rounded-xl gap-2",
};

function Button({
  children,
  to,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:opacity-50 disabled:pointer-events-none",
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default memo(Button);
