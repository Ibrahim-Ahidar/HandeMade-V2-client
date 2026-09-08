import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const RequireAuth = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "loading") return null;

  if (auth.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
