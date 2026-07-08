import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

const DEFAULT_MAX = 500;

function filterAndSort(products, { category, sort, q, minPrice, maxPrice }) {
  let result = [...products];

  if (category && category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  if (q.trim()) {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.artisan.name.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  switch (sort) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => b.id - a.id);
      break;
    case "featured":
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return result;
}

export function useProductFilters(products) {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "featured";
  const q = searchParams.get("q") || "";
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? DEFAULT_MAX);

  const debouncedQ = useDebounce(q, 250);

  const setParam = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const isDefault =
            value === "" ||
            value == null ||
            (key === "category" && value === "all") ||
            (key === "sort" && value === "featured") ||
            (key === "minPrice" && Number(value) === 0) ||
            (key === "maxPrice" && Number(value) === DEFAULT_MAX);

          if (isDefault) next.delete(key);
          else next.set(key, String(value));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback((value) => setParam("q", value), [setParam]);
  const setCategory = useCallback((value) => setParam("category", value), [setParam]);
  const setSort = useCallback((value) => setParam("sort", value), [setParam]);
  const setPriceRange = useCallback(
    ([min, max]) => {
      setParam("minPrice", min);
      setParam("maxPrice", max);
    },
    [setParam]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filteredProducts = useMemo(
    () =>
      filterAndSort(products, {
        category,
        sort,
        q: debouncedQ,
        minPrice,
        maxPrice,
      }),
    [products, category, sort, debouncedQ, minPrice, maxPrice]
  );

  return {
    category,
    sort,
    searchQuery: q,
    priceRange: [minPrice, maxPrice],
    filteredProducts,
    setSearch,
    setCategory,
    setSort,
    setPriceRange,
    resetFilters,
  };
}
