import { memo } from "react";
import { cn } from "../../utils/cn";
import { Card } from "../ui";
import { useI18n } from "../../context/I18nContext";
import ProductMiniCard from "./ProductMiniCard";
import { ArtisanCard } from "../features";
import Reveal from "./Reveal";

const signupPath = "/signup";

function FeatureCopy({ eyebrow, title, accent, body }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-balance font-serif text-2xl font-semibold leading-tight text-text-primary sm:text-3xl md:text-4xl">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-accent">{accent}</span>
          </>
        ) : null}
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary md:text-base">{body}</p>
    </div>
  );
}

function SellVisual({ stats }) {
  const { t } = useI18n();
  return (
    <Card className="lift overflow-hidden">
      <div className="grid min-w-0 grid-cols-3 divide-x divide-border">
        {[
          { label: t("features.sellSales"), value: stats.sales },
          { label: t("features.sellCvr"), value: stats.cvr },
          { label: t("features.sellViews"), value: stats.views },
        ].map((item) => (
          <div key={item.label} className="min-w-0 px-2 py-6 text-center sm:px-4 md:px-6 md:py-8">
            <p className="font-serif text-xl font-semibold text-text-primary sm:text-2xl md:text-3xl">{item.value}</p>
            <p className="mt-2 text-[11px] leading-snug text-text-secondary sm:text-xs">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-3 text-center text-xs text-text-secondary">
        {t("features.sellPreview")}
      </p>
    </Card>
  );
}

function InsightsVisual({ products }) {
  const { t } = useI18n();
  return (
    <Card className="lift p-4 md:p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {t("features.insightsPreview")}
      </p>
      <div className="flex flex-col gap-3">
        {products.slice(0, 3).map((product) => (
          <ProductMiniCard key={product.id} product={product} />
        ))}
      </div>
    </Card>
  );
}

function FeatureBands({ artisans, insightProducts, sellStats }) {
  const { t } = useI18n();

  const bands = [
    {
      id: "sell",
      eyebrow: t("features.sellEyebrow"),
      title: t("features.sellTitle"),
      body: t("features.sellBody"),
      visual: <SellVisual stats={sellStats} />,
      reverse: true,
    },
    {
      id: "trust",
      eyebrow: t("features.trustEyebrow"),
      title: t("features.trustTitle"),
      body: t("features.trustBody"),
      visual: (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {artisans.slice(0, 2).map(({ artisan, productCount, sampleImage }) => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              productCount={productCount}
              sampleImage={sampleImage}
              to={signupPath}
            />
          ))}
        </div>
      ),
      reverse: false,
    },
    {
      id: "insights",
      eyebrow: t("features.insightsEyebrow"),
      title: t("features.insightsTitle"),
      body: t("features.insightsBody"),
      visual: <InsightsVisual products={insightProducts} />,
      reverse: true,
    },
  ];

  return (
    <>
      {bands.map((band) => (
        <section
          key={band.id}
          id={band.id}
          className="scroll-mt-28 mx-auto max-w-7xl section-x section-y"
        >
          <div
            className={cn(
              "grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12",
              band.reverse && "lg:[&>:first-child]:order-2"
            )}
          >
            <Reveal delay={band.reverse ? 160 : 0} className="min-w-0">
              <FeatureCopy
                eyebrow={band.eyebrow}
                title={band.title}
                accent={band.accent}
                body={band.body}
              />
            </Reveal>
            <Reveal delay={band.reverse ? 0 : 160} className="min-w-0">{band.visual}</Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

export default memo(FeatureBands);
