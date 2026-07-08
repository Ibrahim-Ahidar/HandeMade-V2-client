import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthRedirectPath } from "../config/navigation";

export function usePostAuthNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (user) => {
      const from = location.state?.from;
      const target = getAuthRedirectPath(user, from);
      navigate(target, { replace: true });
    },
    [navigate, location.state]
  );
}
