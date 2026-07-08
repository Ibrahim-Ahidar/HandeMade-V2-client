import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../hooks/ThemeContext";
import { fallbackProducts } from "../../api/products";
import { cn } from "../../utils/cn";
import { appCommandActions, adminCommandActions } from "../../config/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isAdmin } = useCurrentUser();
  const { toggleTheme } = useTheme();

  const systemActions = useMemo(
    () => [
      {
        id: "theme",
        label: "Toggle theme",
        keywords: "dark light mode",
        action: () => toggleTheme(),
      },
      {
        id: "logout",
        label: "Log out",
        keywords: "sign out exit",
        action: async () => {
          await logout();
          navigate("/Home");
        },
      },
    ],
    [toggleTheme, logout, navigate]
  );

  const productItems = useMemo(
    () =>
      fallbackProducts.slice(0, 8).map((p) => ({
        id: `product-${p.id}`,
        label: p.name,
        keywords: `${p.category} ${p.artisan?.name ?? ""} ${(p.tags ?? []).join(" ")}`,
        path: `/product/${p.id}`,
      })),
    []
  );

  const allItems = useMemo(() => {
    const navActions = isAdmin ? adminCommandActions : appCommandActions;
    return [...navActions, ...(isAdmin ? [] : productItems), ...systemActions];
  }, [isAdmin, productItems, systemActions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.keywords ?? "").toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const runItem = useCallback(
    (item) => {
      if (item.path) navigate(item.path);
      else item.action?.();
      onClose();
      setQuery("");
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActiveIndex(0);
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      runItem(filtered[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-start justify-center p-4 pt-[15vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close command palette"
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-elevated)]">
        <div className="border-b border-border px-4 py-3">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, products, actions…"
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
            aria-label="Command search"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-text-secondary">No results</li>
          ) : (
            filtered.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => runItem(item)}
                  className={cn(
                    "flex w-full items-center px-4 py-2.5 text-left text-sm transition",
                    index === activeIndex ? "bg-accent/10 text-accent" : "text-text-primary hover:bg-bg-muted"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-border px-4 py-2 text-xs text-text-secondary">
          ↑↓ navigate · ↵ select · esc close
        </div>
      </div>
    </div>
  );
}

export default memo(CommandPalette);
