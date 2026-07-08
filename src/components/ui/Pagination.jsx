import { memo } from "react";
import { cn } from "../../utils/cn";
import Button from "./Button";

function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="px-3 text-sm text-text-secondary">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

export default memo(Pagination);
