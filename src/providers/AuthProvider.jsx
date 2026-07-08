/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { refreshAccessToken, setupAuthInterceptors, syncAccessToken } from "../api/axios";
import { getMe } from "../api/users";
import { logout as logoutRequest } from "../services/auth";

const AuthContext = createContext();

/** Proactive refresh before the 15m access token expires. */
const ACCESS_TOKEN_REFRESH_MS = 13 * 60 * 1000;

const INIT_REFRESH_MAX_ATTEMPTS = 3;
const INIT_REFRESH_RETRY_MS = 200;

function isRetriableRefreshError(error) {
  if (!error) return false;
  if (error.code === "ERR_CANCELED" || error.message === "canceled") return true;
  return !error.response;
}

export const AuthProvider = ({ children }) => {
  const [status, setStatus] = useState("loading");
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken;
  const skipNextUserFetchRef = useRef(false);

  useEffect(() => {
    setupAuthInterceptors({
      getToken: () => accessTokenRef.current,
      handleTokenRefresh: (token) => {
        syncAccessToken(token);
        setAccessToken((prev) => (prev === token ? prev : token));
      },
      handleUnauthenticated: () => {
        syncAccessToken(null);
        setAccessToken(null);
        setUser(null);
        setUserLoading(false);
        setStatus("unauthenticated");
      },
    });
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setUserLoading(true);
    try {
      const profile = await getMe();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      for (let attempt = 0; attempt < INIT_REFRESH_MAX_ATTEMPTS; attempt += 1) {
        try {
          const token = await refreshAccessToken();
          if (!isMounted) return;

          if (!token) {
            syncAccessToken(null);
            setAccessToken(null);
            setUser(null);
            setStatus("unauthenticated");
            return;
          }

          syncAccessToken(token);
          setAccessToken(token);

          setUserLoading(true);
          try {
            const profile = await getMe();
            if (!isMounted) return;
            setUser(profile);
          } catch {
            if (!isMounted) return;
            syncAccessToken(null);
            setAccessToken(null);
            setUser(null);
            setStatus("unauthenticated");
            return;
          } finally {
            if (isMounted) setUserLoading(false);
          }

          setStatus("authenticated");
          return;
        } catch (error) {
          if (!isMounted) return;
          const shouldRetry =
            attempt < INIT_REFRESH_MAX_ATTEMPTS - 1 && isRetriableRefreshError(error);
          if (shouldRetry) {
            await new Promise((resolve) => {
              setTimeout(resolve, INIT_REFRESH_RETRY_MS * (attempt + 1));
            });
            continue;
          }
          syncAccessToken(null);
          setAccessToken(null);
          setUser(null);
          setStatus("unauthenticated");
          return;
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return undefined;

    const intervalId = setInterval(async () => {
      try {
        const token = await refreshAccessToken();
        if (!token) {
          syncAccessToken(null);
          setAccessToken(null);
          setUser(null);
          setStatus("unauthenticated");
          return;
        }
        syncAccessToken(token);
        setAccessToken((prev) => (prev === token ? prev : token));
      } catch {
        // Keep the current session on transient network errors.
      }
    }, ACCESS_TOKEN_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, [status]);

  const setAuthenticated = useCallback((token, authUser = null) => {
    syncAccessToken(token);
    setAccessToken(token);
    setStatus("authenticated");
    if (authUser) {
      skipNextUserFetchRef.current = true;
      setUser(authUser);
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      setUser(null);
      setUserLoading(false);
      return undefined;
    }

    if (status !== "authenticated") return undefined;

    if (skipNextUserFetchRef.current) {
      skipNextUserFetchRef.current = false;
      return undefined;
    }

    if (user) return undefined;

    let active = true;
    setUserLoading(true);

    getMe()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setUserLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status, user]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear client session even if the server request fails.
    }
    syncAccessToken(null);
    setAccessToken(null);
    setUser(null);
    setUserLoading(false);
    setStatus("unauthenticated");
  }, []);

  const authValue = useMemo(
    () => ({
      status,
      accessToken,
      user,
      userLoading,
      isAdmin: user?.role === "admin",
      setAuthenticated,
      refreshUser: fetchUserProfile,
      logout,
    }),
    [status, accessToken, user, userLoading, setAuthenticated, fetchUserProfile, logout]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
