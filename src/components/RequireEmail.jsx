import { Outlet, Navigate } from "react-router-dom";
import { useRecovery } from "../providers/RecoveryProvider";

const RequireEmail = ({ fallback = "/login" }) => {
  const { email } = useRecovery();

  if (!email) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default RequireEmail;
