import { memo, useCallback, useState } from "react";
import { Button, Card } from "../ui";
import { useI18n } from "../../context/I18nContext";
import { marketingImages } from "../../data/marketingImages";
import Accordion from "./Accordion";
import Reveal from "./Reveal";

function FaqSection() {
  const { t, messages } = useI18n();
  const [openIndex, setOpenIndex] = useState(0);
  const onToggle = useCallback((i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section id="faq" className="scroll-mt-28 bg-bg-muted section-y">
      <div className="mx-auto grid max-w-7xl min-w-0 items-start gap-8 section-x md:grid-cols-2 md:gap-12">
        <Reveal className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t("faq.eyebrow")}</p>
          <h2 className="mt-2 text-balance font-serif text-2xl font-semibold leading-tight text-text-primary sm:text-3xl md:text-4xl">
            {t("faq.titleBefore")}
            <br />
            {t("faq.titleAfter")}
          </h2>
          <p className="mt-4 text-sm text-text-secondary">{t("faq.subtitle")}</p>
        </Reveal>
        <Reveal delay={160} className="min-w-0">
          <Accordion items={messages.faq.items} openIndex={openIndex} onToggle={onToggle} />
        </Reveal>
      </div>
    </section>
  );
}

function StepsSection() {
  const { t, messages } = useI18n();

  return (
    <section id="how-it-works" className="scroll-mt-28 mx-auto max-w-7xl section-x section-y">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t("steps.eyebrow")}</p>
        <h2 className="mt-2 text-balance font-serif text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl">
          {t("steps.title")}
        </h2>
        <p className="mt-4 max-w-xl text-sm text-text-secondary">{t("steps.subtitle")}</p>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {messages.steps.items.map((step, i) => (
          <Reveal key={step.title} delay={i * 140} className="min-w-0">
            <Card className="lift h-full p-6 md:p-8">
              <span className="step-num flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  const { t, messages } = useI18n();

  return (
    <section className="relative overflow-hidden section-y">
      <img
        src={marketingImages.cta}
        alt=""
        className="img-marketing hero-zoom absolute inset-0 h-full w-full"
        aria-hidden="true"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-bg-primary/85 dark:bg-bg-primary/90" />
      <div className="relative mx-auto max-w-2xl section-x text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t("pricing.eyebrow")}</p>
          <h2 className="mt-2 text-balance font-serif text-2xl font-semibold text-text-primary sm:text-3xl md:text-4xl">
            {t("pricing.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">{t("pricing.subtitle")}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {messages.pricing.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-border bg-bg-elevated/80 px-3 py-1 text-xs font-medium text-text-secondary"
              >
                {chip}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/signup" variant="primary" size="lg" className="w-full sm:w-auto">
              {t("cta.primary")}
            </Button>
            <Button to="/contact" variant="outline" size="lg" className="w-full sm:w-auto">
              {t("cta.secondary")}
            </Button>
          </div>
          <p className="mt-4 text-xs text-text-secondary">{t("pricing.billedNote")}</p>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(FaqSection);
export { StepsSection, FinalCta };
