import API from "./axios";

export async function getMe() {
  const res = await API.get("/users/me");
  return res.data.data?.user ?? res.data.user;
}

export async function updateMe(payload) {
  const res = await API.patch("/users/me", payload);
  return res.data.data?.user ?? res.data.user;
}

export async function becomeSeller(payload = {}) {
  const res = await API.post("/users/become-seller", payload);
  return res.data.data?.user ?? res.data.user;
}

export async function getShop(userId) {
  const res = await API.get(`/users/${userId}/shop`);
  return res.data.data ?? res.data;
}
