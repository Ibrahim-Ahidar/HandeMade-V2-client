import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "../components/ui";
import { SUPPORT_EMAIL } from "../config/support";
import { useAuth } from "../providers/AuthProvider";
import { homeStats } from "../utils/homeData";
import side1 from "../assets/imgs/home/side1.jpg";

const values = [
  {
    icon: "✦",
    title: "Authentic craft",
    body: "Every item is genuinely handmade. We champion makers, not mass production.",
  },
  {
    icon: "🌱",
    title: "Sustainability",
    body: "Mindful materials, slower consumption, and stories that outlast trends.",
  },
  {
    icon: "⚖️",
    title: "Fair trade",
    body: "Low fees so artisans keep what they earn. Buyers pay transparent prices.",
  },
  {
    icon: "❤️",
    title: "Human connection",
    body: "A marketplace built on trust between maker and buyer — not algorithms alone.",
  },
];

function About() {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <section className="relative overflow-hidden rounded-3xl">
        <img src={side1} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/95 via-bg-primary/80 to-transparent" />
        <div className="relative px-8 py-20 md:px-16 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Our mission</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold text-text-primary md:text-5xl">
            Celebrating handmade craftsmanship
          </h1>
          <p className="mt-4 max-w-lg text-text-secondary">
            HandeMade connects independent artisans with buyers who value quality, authenticity,
            and the human touch behind every piece.
          </p>
        </div>
      </section>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <PageHeader
            title="Artisan-first, always"
            description="We started with a simple belief: tools should serve makers, not the other way around. HandeMade gives craftspeople a beautiful storefront, honest analytics, and buyers who care about how things are made."
          />
          <p className="text-sm leading-relaxed text-text-secondary">
            When you buy handmade, you support real skills — pottery wheels, looms, benches, and
            studios. When you sell, you join a community that treats your work as art, not inventory.
          </p>
        </div>
        <Card className="p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Impact</h3>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {[
              { label: "Artisans", value: homeStats.artisans },
              { label: "Countries", value: homeStats.countries },
              { label: "Products sold", value: homeStats.productsSold },
              { label: "Craft categories", value: "9+" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl font-semibold text-text-primary">{s.value}</p>
                <p className="text-sm text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-20">
        <h2 className="text-center font-serif text-2xl font-semibold text-text-primary">What we stand for</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} className="p-6">
              <span className="text-2xl">{v.icon}</span>
              <h3 className="mt-4 font-semibold text-text-primary">{v.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
        <Card className="mt-20 p-8 text-center md:p-12">
          <h2 className="font-serif text-2xl font-semibold text-text-primary">Join the community</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary">
            Whether you make, collect, or simply appreciate craft — there is a place for you here.
          </p>
          <p className="mx-auto mt-4 text-sm text-text-secondary">
            Questions? Email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-accent hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/signup" variant="primary">
              Create free account
            </Button>
            <Button to="/login" variant="outline">
              Log in
            </Button>
            <Link to="/contact" className="text-sm text-text-secondary hover:text-accent self-center">
              Contact us →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default About;
