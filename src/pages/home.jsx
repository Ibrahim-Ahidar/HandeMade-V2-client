import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Badge } from "../components/ui";
import { ArtisanCard } from "../components/features";
import { categories } from "../data/categories";
import { marketingImages } from "../data/marketingImages";
import { getFeaturedArtisans, getCategoryPreview, homeStats, products } from "../utils/homeData";

const signupPath = "/signup";
const loginPath = "/login";

const steps = [
  {
    title: "Discover",
    body: "Browse curated handmade goods from verified artisans worldwide.",
  },
  {
    title: "Connect",
    body: "Learn the story behind each maker — materials, process, and passion.",
  },
  {
    title: "Support craft",
    body: "Every purchase goes directly to the artisan who made it by hand.",
  },
];

function Home() {
  const artisans = useMemo(() => getFeaturedArtisans(products, 4), []);
  const categoryImages = useMemo(() => getCategoryPreview(products), []);

  const getCategoryImage = (slug) =>
    marketingImages.categories[slug] ?? categoryImages.get(slug) ?? null;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh]">
        <img
          src={marketingImages.hero}
          alt="Artisan shaping clay on a pottery wheel in warm studio light"
          className="img-marketing absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary/90 via-bg-primary/70 to-accent/20 dark:from-bg-primary/95 dark:via-bg-primary/80" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-32 md:px-6 md:py-40">
          <Badge variant="accent" className="mb-6 w-fit">
            Craft × Commerce
          </Badge>
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-text-primary md:text-6xl">
            Handmade goods with{" "}
            <span className="text-accent">human stories</span> behind every piece.
          </h1>
          <p className="mt-8 max-w-xl text-base text-text-secondary md:text-lg">
            HandeMade connects independent artisans with buyers who value authenticity,
            quality materials, and the care that only comes from making by hand.
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button to={signupPath} variant="primary" size="lg">
              Get started
            </Button>
            <Button to={loginPath} variant="outline" size="lg">
              Log in
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg-elevated">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border px-4 py-12 md:px-6 lg:px-8">
          {[
            { label: "Artisans", value: homeStats.artisans },
            { label: "Products sold", value: homeStats.productsSold },
            { label: "Countries", value: homeStats.countries },
          ].map((stat) => (
            <div key={stat.label} className="px-4 text-center">
              <p className="font-serif text-3xl font-semibold text-text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured artisans */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Makers</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-text-primary">Featured artisans</h2>
          </div>
          <Button to={signupPath} variant="ghost" size="sm">
            Sign up to browse →
          </Button>
        </div>
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {artisans.map(({ artisan, productCount, sampleImage }) => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              productCount={productCount}
              sampleImage={sampleImage}
              to={signupPath}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Browse</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-text-primary">Shop by category</h2>
          <div className="mt-12 grid gap-4 md:mt-16 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat) => {
              const img = getCategoryImage(cat.slug);
              return (
                <Link
                  key={cat.id}
                  to={signupPath}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-bg-muted">
                    {img ? (
                      <img
                        src={img}
                        alt={`${cat.name} handmade crafts`}
                        className="img-marketing img-marketing-hover h-full w-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-accent/10 to-accent-warm/20" />
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Simple</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-text-primary">How it works</h2>
        <div className="mt-12 grid gap-6 md:mt-16 md:gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="p-6 md:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Story panels */}
      <section className="grid md:grid-cols-2">
        {[
          {
            img: marketingImages.storyShop,
            alt: "Handmade goods displayed in a warm craft shop",
            title: "Shop with confidence",
            body: "Every listing is made by a real artisan. Transparent pricing, honest descriptions, secure checkout coming soon.",
          },
          {
            img: marketingImages.storySell,
            alt: "Artisan hands shaping pottery on a wheel",
            title: "Sell on your terms",
            body: "List products in minutes, manage inventory from your dashboard, and grow a community around your craft.",
          },
        ].map((panel) => (
          <div key={panel.title} className="relative min-h-[360px] md:min-h-[420px]">
            <img
              src={panel.img}
              alt={panel.alt}
              className="img-marketing absolute inset-0 h-full w-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
              <h3 className="font-serif text-2xl font-semibold text-white">{panel.title}</h3>
              <p className="mt-3 max-w-md text-sm text-white/85">{panel.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <img
          src={marketingImages.cta}
          alt=""
          className="img-marketing absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-bg-primary/85 dark:bg-bg-primary/90" />
        <div className="relative mx-auto max-w-2xl px-4 text-center md:px-6">
          <h2 className="font-serif text-3xl font-semibold text-text-primary md:text-4xl">
            Ready to find something made just for you?
          </h2>
          <p className="mt-4 text-text-secondary">
            Join thousands of buyers supporting independent makers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to={signupPath} variant="primary" size="lg">
              Create free account
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              Get in touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
