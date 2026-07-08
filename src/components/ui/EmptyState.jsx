import { memo } from "react";
import { cn } from "../../utils/cn";
import Button from "./Button";

function EmptyState({ icon, title, description, actionLabel, onAction, actionTo, className }) {
  return (
    <div className={cn("flex flex-col items-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-4xl text-text-secondary">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {(actionLabel && (onAction || actionTo)) && (
        <div className="mt-6">
          {actionTo ? (
            <Button to={actionTo} variant="primary">
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(EmptyState);
