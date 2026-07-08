import { memo, useState } from "react";
import { cn } from "../../utils/cn";

function ImageGallery({ images, productName }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-bg-muted">
        <img
          src={images[selected]}
          alt={`${productName} — view ${selected + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                selected === index
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/40"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ImageGallery);
