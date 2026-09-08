import { fallbackProducts } from "../api/products";

export function getFeaturedArtisans(products, limit = 4) {
  const map = new Map();

  for (const product of products) {
    const id = product.artisan.id;
    if (!map.has(id)) {
      map.set(id, {
        artisan: product.artisan,
        productCount: 1,
        sampleImage: product.images[0],
      });
    } else {
      map.get(id).productCount += 1;
    }
  }

  return [...map.values()].slice(0, limit);
}

export function getCategoryPreview(products) {
  const byCategory = new Map();
  for (const product of products) {
    if (!byCategory.has(product.category)) {
      byCategory.set(product.category, product.images[0]);
    }
  }
  return byCategory;
}

export const homeStats = {
  artisans: "240+",
  productsSold: "12k+",
  countries: "38",
};

export function getCategoryMix(productList, limit = 4) {
  const counts = new Map();
  for (const product of productList) {
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
  }
  const total = productList.length || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, count]) => ({
      slug,
      count,
      percent: Math.round((count / total) * 100),
    }));
}

export function getHeroProducts(productList, limit = 2) {
  const featured = productList.filter((p) => p.featured);
  const source = featured.length >= limit ? featured : productList;
  return source.slice(0, limit);
}

export { fallbackProducts as products };
