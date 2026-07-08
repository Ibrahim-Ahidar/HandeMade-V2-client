import { Outlet } from "react-router-dom";
import RequireEmail from "./RequireEmail.jsx";

export default function RequireSignupEmail() {
  return <RequireEmail fallback="/signup" />;
}
