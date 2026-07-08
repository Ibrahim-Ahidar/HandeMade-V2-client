import { useEffect, useCallback } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../components/ui";
import { cn } from "../utils/cn";

function NotFound() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  const openCommand = useCallback(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const hint = document.getElementById("cmd-hint");
    if (hint) hint.textContent = isMac ? "⌘K" : "Ctrl+K";
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-text-primary md:text-5xl">
        This page wandered off
      </h1>
      <p className="mt-4 max-w-md text-text-secondary">
        {isAuthenticated
          ? "The route you requested does not exist. Use the command palette to jump anywhere quickly."
          : "The page you requested does not exist or requires an account."}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        {isAuthenticated ? (
          <>
            <Button to="/products" variant="primary">
              Browse products
            </Button>
            <Button to="/seller" variant="outline">
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button to="/Home" variant="primary">
              Back to home
            </Button>
            <Button to="/signup" variant="outline">
              Sign up
            </Button>
          </>
        )}
      </div>

      {isAuthenticated && (
        <button
          type="button"
          onClick={openCommand}
          className={cn(
            "mt-10 flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm text-text-secondary",
            "transition hover:border-accent/30 hover:text-text-primary"
          )}
        >
          <span>Search pages & products</span>
          <kbd
            id="cmd-hint"
            className="rounded border border-border bg-bg-muted px-2 py-0.5 font-mono text-xs text-text-primary"
          >
            ⌘K
          </kbd>
        </button>
      )}
    </div>
  );
}

export default NotFound;
