import API from "./axios";
import { products as fallbackProducts } from "../data/products";

export async function getProducts() {
  try {
    const res = await API.get("/products");
    return res.data.products ?? fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProductById(id) {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data.product ?? null;
  } catch {
    const all = await getProducts();
    return all.find((p) => String(p.id) === String(id)) ?? null;
  }
}

export async function createProduct(formData) {
  const res = await API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data?.product ?? res.data.product;
}

export async function updateProduct(id, formData) {
  const res = await API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data?.product ?? res.data.product;
}

export async function deleteProduct(id) {
  const res = await API.delete(`/products/${id}`);
  return res.data;
}

export { fallbackProducts };
