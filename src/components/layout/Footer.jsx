import { memo } from "react";
import { Link } from "react-router-dom";
import { guestFooterExplore, guestFooterAccount } from "../../config/navigation";

function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-serif text-xl font-semibold text-text-primary">HandeMade</h3>
            <p className="mt-3 max-w-sm text-sm text-text-secondary">
              A marketplace where artisans sell handmade goods to buyers who value craft, story, and quality.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {guestFooterExplore.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-text-primary hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Account</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {guestFooterAccount.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-text-primary hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} HandeMade. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
