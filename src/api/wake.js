const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

let woken = false;

/** Fire-and-forget ping so a sleeping Render instance can start while the UI paints. */
export function wakeBackend() {
  if (woken || typeof fetch !== "function") return;
  woken = true;
  fetch(`${API_BASE}/health`, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
    credentials: "omit",
  }).catch(() => {});
}
