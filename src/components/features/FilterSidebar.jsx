import { memo } from "react";
import { cn } from "../../utils/cn";
import { Button, Card, Select } from "../ui";
import { categories } from "../../data/categories";

function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onReset,
  className,
}) {
  return (
    <Card className={cn("p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto", className)}>
      <h2 className="mb-4 hidden text-sm font-semibold uppercase tracking-wider text-text-secondary lg:block">
        Filters
      </h2>

      <div className="mb-6">
        <Select label="Sort by" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
        </Select>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Category</p>
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-bg-muted">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="accent-[var(--accent)]"
            />
            <span className="text-sm text-text-primary">All products</span>
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-bg-muted"
            >
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={selectedCategory === category.slug}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="accent-[var(--accent)]"
              />
              <span className="text-sm text-text-primary">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">Price range</p>
        <div className="mb-2 flex justify-between text-xs text-text-secondary">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[0]}
          onChange={(e) => {
            const min = parseInt(e.target.value, 10);
            if (min <= priceRange[1]) onPriceRangeChange([min, priceRange[1]]);
          }}
          className="mb-3 w-full accent-[var(--accent)]"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => {
            const max = parseInt(e.target.value, 10);
            if (max >= priceRange[0]) onPriceRangeChange([priceRange[0], max]);
          }}
          className="w-full accent-[var(--accent)]"
          aria-label="Maximum price"
        />
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
        Reset filters
      </Button>
    </Card>
  );
}

export default memo(FilterSidebar);
