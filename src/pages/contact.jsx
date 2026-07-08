import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { submitContact } from "../api/contact";
import { SUPPORT_EMAIL } from "../config/support";
import { DEFAULT_ADMIN_REDIRECT } from "../config/navigation";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  Button,
  Card,
  Input,
  PageHeader,
  Textarea,
  useToast,
} from "../components/ui";
import { cn } from "../utils/cn";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Browse products, add to cart, and checkout when ready. Secure payments are coming soon.",
  },
  {
    q: "Are products really handmade?",
    a: "Yes — every listing is made by an independent artisan. We celebrate craft authenticity.",
  },
  {
    q: "Can I sell on HandeMade?",
    a: "Absolutely. Create an account, then list your first piece from the Sell page in minutes.",
  },
  {
    q: "What is your return policy?",
    a: "Return policies vary by artisan. Contact us or the seller directly for order issues.",
  },
];

function Contact() {
  const { toast } = useToast();
  const { user } = useCurrentUser();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.username || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";
    else if (form.message.trim().length < 10) next.message = "At least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  if (user?.role === "admin") {
    return <Navigate to={DEFAULT_ADMIN_REDIRECT} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast("Message sent! We'll reply within 24 hours.", "success");
      setForm({ name: user?.username ?? "", email: user?.email ?? "", subject: "", message: "" });
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Could not send your message. Try again or email us directly.";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <PageHeader
        title="Contact us"
        description="Questions about an order, selling, or partnerships? We're here to help."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text-primary">Send a message</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              error={errors.name}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              error={errors.email}
              placeholder="you@email.com"
            />
            <Input
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={(e) => setField("subject", e.target.value)}
              error={errors.subject}
              placeholder="How can we help?"
            />
            <Textarea
              label="Message"
              name="message"
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              error={errors.message}
              rows={5}
              placeholder="Tell us more…"
            />
            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text-primary">Get in touch</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-text-secondary">Email</dt>
                <dd>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-text-primary hover:text-accent"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-text-secondary">Support hours</dt>
                <dd className="text-text-primary">Mon–Fri, 9:00–18:00 CET</dd>
              </div>
              <div>
                <dt className="font-medium text-text-secondary">Based in</dt>
                <dd className="text-text-primary">Madrid, Spain · serving makers worldwide</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-text-primary">Selling on HandeMade?</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Head to the seller dashboard or list your first product — no listing fees.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button to="/sell" variant="outline" size="sm">
                Start selling
              </Button>
              <Button to="/about" variant="ghost" size="sm">
                Our story
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-text-primary">
          Frequently asked questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-2">
          {FAQS.map((faq, i) => (
            <Card key={faq.q} className="overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-text-primary hover:bg-bg-muted"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                {faq.q}
                <span className={cn("text-text-secondary transition", openFaq === i && "rotate-180")}>▼</span>
              </button>
              {openFaq === i && (
                <p className="border-t border-border px-4 py-4 text-sm text-text-secondary">{faq.a}</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Contact;
