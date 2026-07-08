import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useProductFilters } from "../hooks/useProductFilters";
import {
  FilterSidebar,
  ProductCard,
  ProductCardSkeleton,
} from "../components/features";
import {
  Drawer,
  EmptyState,
  FilterChip,
  PageHeader,
  SearchBar,
} from "../components/ui";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    category,
    sort,
    searchQuery,
    priceRange,
    filteredProducts,
    setSearch,
    setCategory,
    setSort,
    setPriceRange,
    resetFilters,
  } = useProductFilters(products);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeFilters = [
    category !== "all" && { label: category, onRemove: () => setCategory("all") },
    priceRange[0] > 0 && { label: `Min $${priceRange[0]}`, onRemove: () => setPriceRange([0, priceRange[1]]) },
    priceRange[1] < 500 && { label: `Max $${priceRange[1]}`, onRemove: () => setPriceRange([priceRange[0], 500]) },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <PageHeader
          title="Marketplace"
          description="Discover unique items crafted by talented artisans. Filters sync to your URL — share what you find."
        />

        <div className="mb-6 flex gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, artisans, tags…"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-bg-muted lg:hidden"
            aria-label="Open filters"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <FilterChip key={f.label} label={f.label} active onRemove={f.onRemove} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sort}
              onSortChange={setSort}
              onReset={resetFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 text-sm text-text-secondary">
              {loading ? "Loading…" : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
            </p>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search query."
                actionLabel="Reset filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" side="left">
        <FilterSidebar
          selectedCategory={category}
          onCategoryChange={(v) => {
            setCategory(v);
          }}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sort}
          onSortChange={setSort}
          onReset={() => {
            resetFilters();
            setFilterOpen(false);
          }}
        />
      </Drawer>
    </div>
  );
}

export default Products;
