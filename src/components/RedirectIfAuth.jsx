import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { DEFAULT_ADMIN_REDIRECT, DEFAULT_AUTH_REDIRECT } from "../config/navigation";

export default function RedirectIfAuth() {
  const { status, user } = useAuth();

  if (status === "authenticated") {
    const target = user?.role === "admin" ? DEFAULT_ADMIN_REDIRECT : DEFAULT_AUTH_REDIRECT;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
