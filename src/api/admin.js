import API from "./axios";

export async function getAdminStats() {
  const res = await API.get("/admin/stats");
  return res.data.data?.stats ?? res.data.stats;
}

export async function getAdminUsers(params = {}) {
  const res = await API.get("/admin/users", { params });
  const data = res.data.data ?? res.data;
  return {
    users: data.users ?? [],
    pagination: data.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 },
  };
}

export async function getAdminProducts(params = {}) {
  const res = await API.get("/admin/products", { params });
  const data = res.data.data ?? res.data;
  return {
    products: data.products ?? [],
    pagination: data.pagination ?? { page: 1, limit: 20, total: 0, pages: 0 },
  };
}

export async function updateAdminUser(id, payload) {
  const res = await API.patch(`/admin/users/${id}`, payload);
  return res.data.data?.user ?? res.data.user;
}

export async function deleteAdminUser(id) {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data.data ?? res.data;
}

export async function updateAdminProduct(id, payload) {
  const res = await API.patch(`/admin/products/${id}`, payload);
  return res.data.data?.product ?? res.data.product;
}

export async function banAdminProduct(id) {
  const res = await API.delete(`/admin/products/${id}/archive`);
  return res.data.data ?? res.data;
}

export async function deleteAdminProduct(id) {
  const res = await API.delete(`/admin/products/${id}`);
  return res.data.data ?? res.data;
}
