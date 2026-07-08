import { memo } from "react";
import { cn } from "../../utils/cn";
import Button from "./Button";

function ErrorState({ title = "Something went wrong", description, onRetry, className }) {
  return (
    <div className={cn("flex flex-col items-center py-16 text-center", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        !
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(ErrorState);
