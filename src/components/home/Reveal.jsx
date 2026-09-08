import { memo } from "react";
import { cn } from "../../utils/cn";
import { useReveal } from "../../hooks/useReveal";

function Reveal({ children, as = "div", delay = 0, className, ...props }) {
  const { ref, shown } = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={cn("reveal", shown && "reveal-in", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default memo(Reveal);
