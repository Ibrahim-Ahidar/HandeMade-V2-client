import { memo, useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useCart } from "../../hooks/CartContext";
import { useTheme } from "../../hooks/ThemeContext";
import { Button, Avatar, Dropdown } from "../ui";
import logoTallLight from "../../assets/imgs/logo-tall.png";
import logoTallDark from "../../assets/imgs/logo-tall-dark.png";
import { cn } from "../../utils/cn";
import { guestNavLinks, appNavLinks, adminNavLinks, DEFAULT_ADMIN_REDIRECT } from "../../config/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function NavLink({ to, label, active, variant }) {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors duration-200",
        variant === "app" && "tracking-tight",
        variant === "admin" && "tracking-tight",
        active ? "text-accent" : "text-text-secondary hover:text-text-primary"
      )}
    >
      {label}
    </Link>
  );
}

function CartButton({ count }) {
  return (
    <Link
      to="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/80 text-text-primary transition hover:bg-bg-muted"
      aria-label={`Cart, ${count} items`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function Navbar({ onOpenCommand }) {
  const { status, logout } = useAuth();
  const { getCartCount } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const { user, isAdmin } = useCurrentUser();
  const variant = isAdmin ? "admin" : isAuthenticated ? "app" : "marketing";
  const links = useMemo(() => {
    if (!isAuthenticated) return guestNavLinks;
    if (isAdmin) return adminNavLinks;
    return appNavLinks;
  }, [isAuthenticated, isAdmin]);
  const logoTo = isAdmin ? DEFAULT_ADMIN_REDIRECT : isAuthenticated ? "/products" : "/Home";
  const isHomePage = location.pathname === "/Home" || location.pathname === "/";
  const cartCount = getCartCount();
  const showNavSpacer = variant === "marketing" && !isHomePage;

  const handleLogout = useCallback(async () => {
    await logout();
    setMobileOpen(false);
    navigate("/Home", { replace: true });
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const avatarMenu = isAdmin
    ? [{ label: "Log out", onClick: handleLogout }]
    : [
        { label: "Profile", onClick: () => navigate("/profile") },
        { label: "Log out", onClick: handleLogout },
      ];

  const navInner = (
  <>
      <Link to={logoTo} className="shrink-0" onClick={closeMobile}>
        <img
          src={isDark ? logoTallDark : logoTallLight}
          alt="HandeMade"
          className={cn(
            "w-auto object-contain",
            variant === "app" ? "h-8 max-w-[110px]" : variant === "admin" ? "h-8 max-w-[110px]" : "h-10 max-w-[130px]"
          )}
        />
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        <div className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              active={location.pathname === to}
              variant={variant}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && !isAdmin && (
            <button
              type="button"
              onClick={onOpenCommand}
              className="hidden items-center gap-2 rounded-xl border border-border bg-bg-muted px-3 py-1.5 text-xs text-text-secondary transition hover:text-text-primary lg:flex"
              aria-label="Open command palette"
            >
              <span>Search</span>
              <kbd className="rounded border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/80 text-text-primary transition hover:bg-bg-muted"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀" : "☾"}
          </button>

          {isAuthenticated && !isAdmin && <CartButton count={cartCount} />}

          {isAuthenticated ? (
            <Dropdown
              align="right"
              className="flex items-center"
              trigger={
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Account menu"
                >
                  <Avatar
                    name={user?.username}
                    email={user?.email}
                    size="sm"
                    letterOnly
                    className="h-9 w-9"
                  />
                </button>
              }
              items={avatarMenu}
            />
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button to="/signup" variant="primary" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        {isAuthenticated && !isAdmin && <CartButton count={cartCount} />}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-text-primary"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
  </>
  );

  if (variant === "app" || variant === "admin") {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-[9999] border-b border-border bg-bg-elevated/95 backdrop-blur-md">
          <nav
            className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6"
            aria-label="Main navigation"
          >
            {navInner}
          </nav>
        </header>
        {mobileOpen && (
          <div className="fixed inset-x-0 top-14 z-[9998] border-b border-border bg-bg-elevated p-4 shadow-[var(--shadow-elevated)] md:hidden">
            <div className="flex flex-col gap-2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight",
                    location.pathname === to ? "bg-accent/10 text-accent" : "text-text-primary"
                  )}
                >
                  {label}
                </Link>
              ))}
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenCommand?.();
                    closeMobile();
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-sm text-text-secondary"
                >
                  Command palette (⌘K)
                </button>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl px-3 py-2.5 text-left text-sm text-text-secondary"
              >
                {isDark ? "Light mode" : "Dark mode"}
              </button>
              <hr className="border-border" />
              {!isAdmin && (
                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight text-text-primary"
                >
                  Profile
                </Link>
              )}
              <Button variant="outline" size="md" onClick={handleLogout} className="w-full">
                Log out
              </Button>
            </div>
          </div>
        )}
        <div className="h-14" aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <header className="fixed left-1/2 top-4 z-[9999] w-[min(calc(100%-2rem),72rem)] -translate-x-1/2">
        <nav
          className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-2 shadow-[var(--shadow-elevated)] backdrop-blur-xl"
          style={{
            background: "var(--glass)",
            borderColor: "var(--glass-border)",
          }}
          aria-label="Main navigation"
        >
          {navInner}
        </nav>

        {mobileOpen && (
          <div
            className="mt-2 rounded-2xl border p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:hidden"
            style={{ background: "var(--glass)", borderColor: "var(--glass-border)" }}
          >
            <div className="flex flex-col gap-2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium",
                    location.pathname === to ? "bg-accent/10 text-accent" : "text-text-primary"
                  )}
                >
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl px-3 py-2.5 text-left text-sm text-text-secondary"
              >
                {isDark ? "Light mode" : "Dark mode"}
              </button>
              <hr className="border-border" />
              <div className="flex flex-col gap-2">
                <Button to="/login" variant="outline" size="md" className="w-full" onClick={closeMobile}>
                  Log in
                </Button>
                <Button to="/signup" variant="primary" size="md" className="w-full" onClick={closeMobile}>
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      {showNavSpacer && <div className="h-[4.25rem]" aria-hidden="true" />}
    </>
  );
}

export default memo(Navbar);
