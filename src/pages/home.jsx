import { useMemo } from "react";
import { homeStats, getFeaturedArtisans, getHeroProducts, getCategoryMix, products } from "../utils/homeData";
import { sellerStats } from "../data/sellerMock";
import { useI18n } from "../context/I18nContext";
import HeroSection, { TrustBar } from "../components/home/HeroSection";
import FeatureBands from "../components/home/FeatureBands";
import MixSection, { DiscoverSection, PlatformSection } from "../components/home/MarketplaceSections";
import FaqSection, { StepsSection, FinalCta } from "../components/home/ClosingSections";

function Home() {
  const { locale } = useI18n();
  const artisans = useMemo(() => getFeaturedArtisans(products, 4), []);
  const heroProducts = useMemo(() => getHeroProducts(products, 2), []);
  const mix = useMemo(() => getCategoryMix(products, 4), []);
  const insightProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 4), []);
  const newProducts = useMemo(() => [...products].slice(-6).reverse(), []);
  const sellStats = useMemo(
    () => ({
      sales: String(sellerStats.totalOrders),
      cvr: `${sellerStats.conversion}%`,
      views: sellerStats.views.toLocaleString(locale),
    }),
    [locale]
  );

  return (
    <div className="overflow-x-hidden">
      <HeroSection products={heroProducts} />
      <TrustBar />
      <FeatureBands artisans={artisans} insightProducts={insightProducts} sellStats={sellStats} />
      <DiscoverSection newProducts={newProducts} featuredProducts={insightProducts} />
      <MixSection mix={mix} stats={homeStats} />
      <PlatformSection />
      <StepsSection />
      <FaqSection />
      <FinalCta />
    </div>
  );
}

export default Home;
