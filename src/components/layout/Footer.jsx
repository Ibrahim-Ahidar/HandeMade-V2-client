import { memo } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { guestFooterMarketplace, guestFooterLearn, guestFooterAccount } from "../../config/navigation";
import Reveal from "../home/Reveal";

function FooterColumn({ title, links, t }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(({ to, labelKey }) => (
          <li key={to}>
            <Link to={to} className="text-text-primary hover:text-accent">
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-7xl section-x py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          <Reveal>
            <h3 className="font-serif text-xl font-semibold text-text-primary">HandeMade</h3>
            <p className="mt-3 max-w-sm text-sm text-text-secondary">{t("footer.tagline")}</p>
          </Reveal>

          <Reveal delay={100}>
            <FooterColumn title={t("footer.marketplace")} links={guestFooterMarketplace} t={t} />
          </Reveal>
          <Reveal delay={200}>
            <FooterColumn title={t("footer.learn")} links={guestFooterLearn} t={t} />
          </Reveal>
          <Reveal delay={300}>
            <FooterColumn title={t("footer.account")} links={guestFooterAccount} t={t} />
          </Reveal>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-xs text-text-secondary">{t("footer.copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
