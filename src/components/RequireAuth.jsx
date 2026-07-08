import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Loader from "./Loader";

const RequireAuth = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "loading") return <Loader />;

  if (auth.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
