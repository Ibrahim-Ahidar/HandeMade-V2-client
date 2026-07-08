import { memo } from "react";
import { Link } from "react-router-dom";
import logoTallLight from "../../assets/imgs/logo-tall.png";
import logoTallDark from "../../assets/imgs/logo-tall-dark.png";
import { marketingImages } from "../../data/marketingImages";
import { useTheme } from "../../hooks/ThemeContext";
import { cn } from "../../utils/cn";

function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  narrow = false,
  centered = false,
  showHero = true,
}) {
  const { isDark, toggleTheme } = useTheme();
  const heroImage = marketingImages.authHero;

  const formInner = (
    <>
      <Link to="/Home" className="mb-5 inline-block">
        <img
          src={isDark ? logoTallDark : logoTallLight}
          alt="HandeMade"
          className="h-8 w-auto max-w-[120px] object-contain sm:h-9"
        />
      </Link>

      {(title || subtitle) && (
        <header className="mb-4 space-y-1">
          {title && (
            <h1 className="font-serif text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs leading-snug text-text-secondary sm:text-sm">{subtitle}</p>
          )}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer className="mt-4 border-t border-border pt-3">{footer}</footer>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "relative flex h-dvh max-h-dvh overflow-hidden bg-bg-primary",
        showHero ? "lg:flex-row" : "flex-col items-center justify-center"
      )}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-elevated/90 text-sm text-text-primary shadow-sm backdrop-blur-sm transition hover:bg-bg-muted sm:right-4 sm:top-4"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? "☀" : "☾"}
      </button>

      {/* Background image — mobile/tablet always; desktop when no split hero */}
      <div className={cn("absolute inset-0", showHero && "lg:hidden")}>
        <img
          src={heroImage}
          alt=""
          className="img-marketing absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        <div className="marketing-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-bg-primary/82 dark:bg-bg-primary/92" />
      </div>

      {/* Form column */}
      <div
        className={cn(
          "relative z-10 flex h-full min-h-0 w-full flex-col justify-center px-4 py-3 sm:px-5 sm:py-4",
          showHero && "lg:w-[45%] lg:items-center lg:px-10 lg:py-6 xl:px-14",
          !showHero && "flex-1",
          centered && !showHero && "items-center"
        )}
      >
        <div
          className={cn(
            "w-full rounded-2xl border border-border bg-bg-elevated/92 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-6",
            narrow ? "max-w-[360px]" : "max-w-[400px]",
            showHero &&
              "lg:max-w-[400px] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none"
          )}
        >
          {formInner}
        </div>
      </div>

      {/* Desktop hero panel */}
      {showHero && (
        <div className="relative hidden h-full min-h-0 flex-1 overflow-hidden lg:block">
          <img
            src={heroImage}
            alt=""
            className="img-marketing absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-accent/25" />
          <div className="absolute bottom-12 left-12 right-12 xl:bottom-16 xl:left-16">
            <p className="font-serif text-2xl font-semibold leading-snug text-white drop-shadow-sm xl:text-3xl">
              Where craft meets commerce.
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
              Join artisans selling handmade goods to buyers who care about the story behind every piece.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AuthLayout);
