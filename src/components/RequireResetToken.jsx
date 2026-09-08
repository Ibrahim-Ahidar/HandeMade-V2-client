import { Outlet, Navigate } from "react-router-dom";
import { useRecovery } from "../providers/RecoveryProvider";

const RequireResetToken = () => {
  const { resetToken } = useRecovery();

  if (!resetToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireResetToken;
