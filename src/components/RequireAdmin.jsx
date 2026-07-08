import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { ErrorState } from "./ui";

export default function RequireAdmin() {
  const { user, userLoading } = useAuth();

  if (userLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorState
          title="Admin access required"
          description="This area is restricted to platform administrators."
        />
      </div>
    );
  }

  return <Outlet />;
}
