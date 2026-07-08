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

export { fallbackProducts as products };
