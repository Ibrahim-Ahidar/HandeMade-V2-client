import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useCart } from "../../hooks/CartContext";
import { useTheme } from "../../hooks/ThemeContext";
import { useI18n } from "../../context/I18nContext";
import { Button, Avatar, Dropdown } from "../ui";
import logoTallLight from "../../assets/imgs/logo-tall.png";
import logoTallDark from "../../assets/imgs/logo-tall-dark.png";
import { cn } from "../../utils/cn";
import { guestNavLinks, appNavLinks, adminNavLinks, DEFAULT_ADMIN_REDIRECT } from "../../config/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function navHref(link) {
  return link.hash ? `${link.to}${link.hash}` : link.to;
}

function isLinkActive(link, location) {
  if (link.hash) {
    const onHome = location.pathname === "/" || location.pathname === "/Home";
    return onHome && location.hash === link.hash;
  }
  return location.pathname === link.to;
}

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

function CartButton({ count, label }) {
  return (
    <Link
      to="/cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/80 text-text-primary transition hover:bg-bg-muted"
      aria-label={label}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
      </svg>
      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function LanguageToggle({ language, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/80 px-2 text-xs font-semibold text-text-primary transition hover:bg-bg-muted"
      aria-label={label}
    >
      {language === "ar" ? "EN" : "ع"}
    </button>
  );
}

function Navbar({ onOpenCommand }) {
  const { status, logout } = useAuth();
  const { getCartCount } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const { t, language, toggleLanguage } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setMobileOpen(false);
    navigate("/Home", { replace: true });
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const avatarMenu = isAdmin
    ? [{ label: t("nav.logout"), onClick: handleLogout }]
    : [
        { label: t("nav.profile"), onClick: () => navigate("/profile") },
        { label: t("nav.logout"), onClick: handleLogout },
      ];

  const navInner = (
  <>
      <Link to={logoTo} className="z-10 min-w-0 shrink justify-self-start" onClick={closeMobile}>
        <img
          src={isDark ? logoTallDark : logoTallLight}
          alt="HandeMade"
          className={cn(
            "h-8 w-auto max-w-[min(6.75rem,42vw)] object-contain sm:max-w-[110px]",
            variant === "app" || variant === "admin"
              ? "max-w-[110px]"
              : "sm:h-10 sm:max-w-[130px]"
          )}
        />
      </Link>

      <div className="hidden items-center justify-center gap-4 lg:flex xl:gap-6">
        {links.map((link) => {
          const href = navHref(link);
          return (
            <NavLink
              key={href}
              to={href}
              label={t(link.labelKey)}
              active={isLinkActive(link, location)}
              variant={variant}
            />
          );
        })}
      </div>

      <div className="z-10 flex items-center justify-end gap-2 justify-self-end">
        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated && !isAdmin && (
            <button
              type="button"
              onClick={onOpenCommand}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg-muted px-3 py-1.5 text-xs text-text-secondary transition hover:text-text-primary"
              aria-label={t("nav.search")}
            >
              <span>{t("nav.search")}</span>
              <kbd className="rounded border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
          )}

          <LanguageToggle language={language} onToggle={toggleLanguage} label={t("nav.language")} />

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/80 text-text-primary transition hover:bg-bg-muted"
            aria-label={isDark ? t("nav.lightMode") : t("nav.darkMode")}
          >
            {isDark ? "☀" : "☾"}
          </button>

          {isAuthenticated && !isAdmin && (
            <CartButton count={cartCount} label={`${t("nav.products")}, ${cartCount}`} />
          )}

          {isAuthenticated ? (
            <Dropdown
              align="right"
              className="flex items-center"
              trigger={
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={t("nav.profile")}
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
                {t("nav.login")}
              </Button>
              <Button to="/signup" variant="primary" size="sm">
                {t("nav.signup")}
              </Button>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageToggle language={language} onToggle={toggleLanguage} label={t("nav.language")} />
          {isAuthenticated && !isAdmin && (
            <CartButton count={cartCount} label={`${t("nav.products")}, ${cartCount}`} />
          )}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-primary"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={t("nav.toggleMenu")}
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
      </div>
  </>
  );

  const mobileLinks = (
    <div className="flex flex-col gap-2">
      {links.map((link) => {
        const href = navHref(link);
        return (
          <Link
            key={href}
            to={href}
            onClick={closeMobile}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-medium",
              variant !== "marketing" && "tracking-tight",
              isLinkActive(link, location) ? "bg-accent/10 text-accent" : "text-text-primary"
            )}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
      {isAuthenticated && !isAdmin && (
        <button
          type="button"
          onClick={() => {
            onOpenCommand?.();
            closeMobile();
          }}
          className="rounded-xl px-3 py-2.5 text-start text-sm text-text-secondary"
        >
          {t("nav.commandPalette")}
        </button>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-xl px-3 py-2.5 text-start text-sm text-text-secondary"
      >
        {isDark ? t("nav.lightMode") : t("nav.darkMode")}
      </button>
      <hr className="border-border" />
      {isAuthenticated ? (
        <>
          {!isAdmin && (
            <Link
              to="/profile"
              onClick={closeMobile}
              className="rounded-xl px-3 py-2.5 text-sm font-medium tracking-tight text-text-primary"
            >
              {t("nav.profile")}
            </Link>
          )}
          <Button variant="outline" size="md" onClick={handleLogout} className="w-full">
            {t("nav.logout")}
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Button to="/login" variant="outline" size="md" className="w-full" onClick={closeMobile}>
            {t("nav.login")}
          </Button>
          <Button to="/signup" variant="primary" size="md" className="w-full" onClick={closeMobile}>
            {t("nav.signup")}
          </Button>
        </div>
      )}
    </div>
  );

  if (variant === "app" || variant === "admin") {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-[9999] border-b border-border bg-bg-elevated/95 backdrop-blur-md">
          <nav
            className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-6"
            aria-label="Main navigation"
          >
            {navInner}
          </nav>
        </header>
        {mobileOpen && (
          <div className="fixed inset-x-0 top-14 z-[9998] border-b border-border bg-bg-elevated p-4 shadow-[var(--shadow-elevated)] lg:hidden">
            {mobileLinks}
          </div>
        )}
        <div className="h-14" aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-[9999] px-3 sm:top-4 sm:px-4">
        <nav
          className={cn(
            "mx-auto grid w-full min-w-0 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-xl transition-[box-shadow] duration-300 sm:gap-4 sm:px-4",
            scrolled ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-soft)]"
          )}
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
            className="mx-auto mt-2 max-w-6xl rounded-2xl border p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl lg:hidden"
            style={{ background: "var(--glass)", borderColor: "var(--glass-border)" }}
          >
            {mobileLinks}
          </div>
        )}
      </header>
      {showNavSpacer && <div className="h-[4.25rem]" aria-hidden="true" />}
    </>
  );
}

export default memo(Navbar);
