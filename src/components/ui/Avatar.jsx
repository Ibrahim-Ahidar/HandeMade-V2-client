import { memo } from "react";
import { cn } from "../../utils/cn";
import { getAvatarColorClass, getAvatarLetter } from "../../utils/avatar";

function Avatar({ src, alt, name, email, size = "md", className, letterOnly = false }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-28 w-28 text-4xl font-semibold",
  };

  const letter = getAvatarLetter(name, email);
  const showImage = Boolean(src) && !letterOnly;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-1 ring-border",
        showImage ? "bg-bg-muted" : getAvatarColorClass(letter),
        sizes[size],
        className
      )}
      aria-label={alt ?? name ?? email}
    >
      {showImage ? (
        <img src={src} alt={alt ?? name ?? ""} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center select-none">
          {letter}
        </span>
      )}
    </div>
  );
}

export default memo(Avatar);
