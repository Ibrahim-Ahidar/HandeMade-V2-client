import { memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

function Breadcrumb({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default memo(Breadcrumb);
