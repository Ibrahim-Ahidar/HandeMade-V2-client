import { memo } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../ui";
import { marketingImages } from "../../data/marketingImages";
import { categories } from "../../data/categories";
import { useI18n } from "../../context/I18nContext";
import ProductMiniCard from "./ProductMiniCard";
import Reveal from "./Reveal";

const signupPath = "/signup";

function HeroSection({ products }) {
  const { t } = useI18n();
  const [first, second] = products;

  return (
    <section className="hero-screen relative overflow-hidden">
      <img
        src={marketingImages.hero}
        alt=""
        className="img-marketing hero-zoom absolute inset-0 h-full w-full"
        fetchPriority="high"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary/90 via-bg-primary/70 to-accent/20 dark:from-bg-primary/95 dark:via-bg-primary/80" />

      <div className="relative mx-auto flex h-full min-h-0 max-w-7xl items-center section-x pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 lg:pb-10">
        <div className="grid w-full min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 max-w-full text-start">
            <div className="hero-enter">
              <Badge variant="accent" className="mb-3 max-w-full whitespace-normal text-start md:mb-6">
                {t("hero.badge")}
              </Badge>
            </div>
            <div className="hero-enter" style={{ animationDelay: "120ms" }}>
              <h1 className="max-w-full break-words font-serif text-[1.75rem] font-semibold leading-snug tracking-tight text-text-primary sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl">
                {t("hero.titleBefore")}
                <span className="text-accent">{t("hero.titleAccent")}</span>
                {t("hero.titleAfter")}
              </h1>
            </div>
            <div className="hero-enter" style={{ animationDelay: "240ms" }}>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:mt-4 sm:text-base md:mt-6 md:text-lg">
                {t("hero.subhead")}
              </p>
            </div>
            <div className="hero-enter" style={{ animationDelay: "360ms" }}>
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap md:mt-8">
                <Button to={signupPath} variant="primary" size="lg" className="w-full sm:w-auto">
                  {t("hero.ctaPrimary")}
                </Button>
                <Button to="/Home#sell" variant="outline" size="lg" className="w-full sm:w-auto">
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative hidden min-w-0 max-w-sm justify-self-center lg:block lg:justify-self-auto">
            <div className="hero-enter" style={{ animationDelay: "240ms" }}>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {t("hero.trailNew")}
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs font-medium text-text-secondary">
                  {t("hero.trailFeatured")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {first ? (
                <div className="hero-enter" style={{ animationDelay: "360ms" }}>
                  <div className="float-slow">
                    <ProductMiniCard product={first} recency={t("hero.listedToday")} />
                  </div>
                </div>
              ) : null}
              {second ? (
                <div className="hero-enter" style={{ animationDelay: "480ms" }}>
                  <div className="ps-6">
                    <div className="float-slow" style={{ animationDelay: "1.5s" }}>
                      <ProductMiniCard product={second} recency={t("hero.listedWeek")} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl section-x py-12">
        <Reveal>
          <p className="text-center text-sm text-text-secondary">{t("trust.title")}</p>
        </Reveal>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 55} className="w-fit max-w-full">
              <Link
                to={signupPath}
                className="chip-lift inline-flex max-w-full items-center rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs font-medium text-text-secondary hover:border-accent/30 hover:text-text-primary"
              >
                {t(`category.${cat.slug}`)}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSection);
export { TrustBar };
