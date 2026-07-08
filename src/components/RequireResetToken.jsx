import { Outlet, Navigate } from "react-router-dom";
import { useRecovery } from "../providers/RecoveryProvider";
import Loader from "../components/Loader"

const RequireResetToken = () => {
    const { resetToken, loading } = useRecovery();
  
    if (loading) return <Loader />;
  
    if (!resetToken) {
      return <Navigate to="/login" replace />;
    }
  
    return <Outlet />;
  };

export default RequireResetToken;