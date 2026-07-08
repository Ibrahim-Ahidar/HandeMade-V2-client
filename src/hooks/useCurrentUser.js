import { useAuth } from "../providers/AuthProvider";

export function useCurrentUser() {
  const { user, userLoading, isAdmin } = useAuth();
  return { user, loading: userLoading, isAdmin };
}
