import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { DEFAULT_ADMIN_REDIRECT } from "../config/navigation";

export default function BlockAdminFromMarketplace() {
  const { user, userLoading } = useAuth();

  if (userLoading) return null;

  if (user?.role === "admin") {
    return <Navigate to={DEFAULT_ADMIN_REDIRECT} replace />;
  }

  return <Outlet />;
}
