import API from "./axios";

export async function submitContact(payload) {
  const res = await API.post("/contact", payload);
  return res.data.data ?? res.data;
}
