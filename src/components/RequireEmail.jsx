import { Outlet, Navigate } from "react-router-dom";
import { useRecovery } from "../providers/RecoveryProvider";
import Loader from "../components/Loader";

const RequireEmail = ({ fallback = "/login" }) => {
  const { email, loading } = useRecovery();

  if (loading) return <Loader />;

  if (!email) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default RequireEmail;
