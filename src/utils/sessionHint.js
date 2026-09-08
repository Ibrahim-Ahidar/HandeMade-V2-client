export const SESSION_HINT_KEY = "handemade-session";

export function readSessionHint() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeSessionHint(on) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(SESSION_HINT_KEY, "1");
    else window.localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    // ignore quota / private mode
  }
}
