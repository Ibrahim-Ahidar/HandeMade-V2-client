import { memo, useState } from "react";
import { Card } from "../ui";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../utils/cn";
import { useReveal } from "../../hooks/useReveal";
import ProductMiniCard from "./ProductMiniCard";
import Reveal from "./Reveal";

function MixSection({ mix, stats }) {
  const { t } = useI18n();
  const maxPercent = mix[0]?.percent || 1;
  const { ref, shown } = useReveal();

  return (
    <section className="bg-bg-muted section-y">
      <div className="mx-auto grid max-w-7xl min-w-0 items-center gap-8 section-x md:grid-cols-2 md:gap-12">
        <Reveal className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t("mix.eyebrow")}</p>
          <h2 className="mt-2 text-balance font-serif text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl">
            {t("mix.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">{t("mix.body")}</p>
          <p className="mt-8 text-sm text-text-secondary">
            {t("mix.reachBody", {
              artisans: stats.artisans,
              countries: stats.countries,
              sold: stats.productsSold,
            })}
          </p>
        </Reveal>
        <div ref={ref} className="min-w-0">
          <Card className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {t("mix.shareLabel")}
            </p>
            <ul className="mt-6 space-y-4">
              {mix.map((row, i) => (
                <li key={row.slug}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-text-primary">{t(`category.${row.slug}`)}</span>
                    <span className="shrink-0 text-text-secondary">{row.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
                    <div
                      className="bar-fill h-full rounded-full bg-accent"
                      style={{
                        width: shown ? `${Math.max(8, (row.percent / maxPercent) * 100)}%` : "0%",
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

function DiscoverSection({ newProducts, featuredProducts }) {
  const { t } = useI18n();
  const [trail, setTrail] = useState("new");
  const shown = trail === "new" ? newProducts : featuredProducts;

  return (
    <section id="discover" className="scroll-mt-28 mx-auto max-w-7xl section-x section-y">
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("discover.eyebrow")}
          </p>
          <h2 className="mt-2 text-balance font-serif text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl">
            {t("discover.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
            {t("discover.body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTrail("new")}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition",
                trail === "new"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:text-text-primary"
              )}
            >
              {t("discover.trailA")}
            </button>
            <button
              type="button"
              onClick={() => setTrail("featured")}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition",
                trail === "featured"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:text-text-primary"
              )}
            >
              {t("discover.trailB")}
            </button>
          </div>
        </Reveal>
        <div key={trail} className="trail-fade flex min-w-0 flex-col gap-3">
          {shown.slice(0, 3).map((product, i) => (
            <Reveal key={product.id} delay={i * 100} className="min-w-0">
              <ProductMiniCard product={product} className="lift" />
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-16 max-w-3xl">
          <h3 className="text-balance font-serif text-xl font-semibold text-text-primary sm:text-2xl md:text-3xl">
            {t("discover.deepTitle")}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
            {t("discover.deepBody")}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function PlatformSection() {
  const { t, messages } = useI18n();

  return (
    <section className="bg-bg-muted section-y">
      <div className="mx-auto max-w-7xl section-x">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {t("platform.eyebrow")}
          </p>
          <h2 className="mt-2 max-w-2xl text-balance font-serif text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl">
            {t("platform.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-text-secondary md:text-base">{t("platform.body")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {messages.platform.items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 100}
              className={cn(i === 0 && "sm:col-span-2 lg:col-span-2")}
            >
              <Card className="lift h-full p-6">
                <h3 className="font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(MixSection);
export { DiscoverSection, PlatformSection };
