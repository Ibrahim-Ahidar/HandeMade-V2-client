import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";
import { MARKETING_PATHS } from "../../config/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function AppShell() {
  const location = useLocation();
  const { status } = useAuth();
  const { isAdmin } = useCurrentUser();
  const [commandOpen, setCommandOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const showFooter = !isAuthenticated && MARKETING_PATHS.includes(location.pathname);
  const showCommandPalette = isAuthenticated && !isAdmin;

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    if (!showCommandPalette) return undefined;

    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showCommandPalette]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar onOpenCommand={showCommandPalette ? openCommand : undefined} />
      <main className="page-enter">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      {showCommandPalette && (
        <CommandPalette open={commandOpen} onClose={closeCommand} />
      )}
    </div>
  );
}

export default memo(AppShell);
