import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Avatar, Card } from "../ui";

function ArtisanCard({ artisan, productCount, sampleImage, className, to = "/products" }) {
  const initials = useMemo(
    () =>
      artisan.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2),
    [artisan.name]
  );

  return (
    <Card
      as={Link}
      to={to}
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        className
      )}
    >
      <div className="relative h-36 overflow-hidden bg-bg-muted">
        {sampleImage ? (
          <img
            src={sampleImage}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent-warm/20 text-3xl font-serif text-accent">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Avatar src={artisan.avatar} name={artisan.name} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white">{artisan.name}</p>
            <p className="text-xs text-white/80">{artisan.location}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm text-text-secondary">{artisan.bio}</p>
        <p className="mt-3 text-xs font-medium text-accent">
          {productCount} {productCount === 1 ? "listing" : "listings"} · View shop →
        </p>
      </div>
    </Card>
  );
}

export default memo(ArtisanCard);
