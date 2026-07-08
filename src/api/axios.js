import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

let refreshInFlight = null;

/** Refresh access token using the httpOnly refresh cookie. Deduplicates concurrent calls. */
export async function refreshAccessToken() {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = axios
    .get(`${API_BASE}/refresh`, { withCredentials: true })
    .then((res) => res.data.accessToken ?? res.data.token ?? null)
    .catch((error) => {
      if (error.code === "ERR_CANCELED" || error.message === "canceled") {
        throw error;
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let getAccessToken = () => null;
let onTokenRefresh = () => {};
let onUnauthenticated = () => {};

/** Update the in-memory token getter immediately (before React re-renders). */
export function syncAccessToken(token) {
  const nextToken = token ?? null;
  getAccessToken = () => nextToken;
}

const NO_REFRESH_PATHS = [
  "/login",
  "/signup",
  "/googleLogin",
  "/googleSignup",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/reset-password",
  "/auth/verify-signup-code",
  "/logout",
];

function shouldSkipTokenRefresh(config) {
  const url = config?.url ?? "";
  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

export const setupAuthInterceptors = ({
  getToken,
  handleTokenRefresh,
  handleUnauthenticated,
}) => {
  if (typeof getToken === "function") getAccessToken = getToken;
  if (typeof handleTokenRefresh === "function") onTokenRefresh = handleTokenRefresh;
  if (typeof handleUnauthenticated === "function") onUnauthenticated = handleUnauthenticated;
};

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const prevRequest = error.config;
    const isRefreshRequest = prevRequest?.url?.includes("/refresh");
    const status = error.response?.status;

    if (isRefreshRequest && (status === 401 || status === 403)) {
      onUnauthenticated();
      return Promise.reject(error);
    }

    const hadAuthHeader = Boolean(prevRequest?.headers?.Authorization);

    if ((status === 401 || (status === 403 && hadAuthHeader)) && prevRequest && !prevRequest._retry) {
      if (shouldSkipTokenRefresh(prevRequest)) {
        return Promise.reject(error);
      }

      prevRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          onUnauthenticated();
          return Promise.reject(error);
        }
        onTokenRefresh(newToken);
        prevRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(prevRequest);
      } catch {
        onUnauthenticated();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
