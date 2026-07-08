import { useState, useCallback, useMemo } from "react";
import { categories } from "../data/categories";
import { createProduct } from "../api/products";
import { cn } from "../utils/cn";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Select,
  Textarea,
  useToast,
} from "../components/ui";

const STEPS = [
  { id: "photos", label: "Photos" },
  { id: "details", label: "Details" },
  { id: "pricing", label: "Pricing" },
  { id: "review", label: "Review" },
];

const INITIAL = {
  productName: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  stock: "",
  tags: "",
  imageFile: null,
};

function Sell() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleImage = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField("imageFile", file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [setField]);

  const validateStep = useCallback(
    (index) => {
      const next = {};
      if (index === 0 && !form.imageFile && !preview) {
        next.image = "Add at least one product photo";
      }
      if (index === 1) {
        if (!form.productName.trim()) next.productName = "Give your piece a name";
        if (!form.description.trim()) next.description = "Tell buyers about your craft";
        else if (form.description.trim().length < 20) next.description = "At least 20 characters helps buyers trust you";
        if (!form.category) next.category = "Pick a category";
      }
      if (index === 2) {
        if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price";
        if (!form.stock || Number(form.stock) < 0) next.stock = "How many can you make?";
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [form, preview]
  );

  const goNext = useCallback(() => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, validateStep]);

  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.productName.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      if (form.originalPrice) formData.append("originalPrice", form.originalPrice);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      if (form.tags.trim()) formData.append("tags", form.tags);
      if (form.imageFile) formData.append("images", form.imageFile);

      await createProduct(formData);
      toast("Your product is live!", "success");
      setForm(INITIAL);
      setPreview(null);
      setStep(0);
    } catch (err) {
      const message =
        err.response?.data?.message ?? "Could not publish listing. Sign in and try again.";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }, [form, toast, validateStep]);

  const categoryLabel = useMemo(
    () => categories.find((c) => c.slug === form.category)?.name ?? form.category,
    [form.category]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <PageHeader
        title="List your handmade piece"
        description="Four quick steps — photos, story, price, and you're live. No jargon, just your craft."
      />

      {/* Progress */}
      <nav className="mb-8 flex gap-2" aria-label="Listing steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition",
                i < step ? "bg-accent text-white" : i === step ? "bg-accent/15 text-accent ring-2 ring-accent" : "bg-bg-muted text-text-secondary"
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-xs font-medium", i === step ? "text-accent" : "text-text-secondary")}>
              {s.label}
            </span>
          </div>
        ))}
      </nav>

      <Card className="p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Show off your work</h2>
            <p className="text-sm text-text-secondary">
              Clear, well-lit photos help buyers fall in love with your piece.
            </p>
            <label className="block cursor-pointer">
              <div
                className={cn(
                  "flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition",
                  preview ? "border-accent" : "border-border hover:border-accent/40",
                  errors.image && "border-danger"
                )}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <span className="text-3xl">📸</span>
                    <p className="mt-2 text-sm font-medium text-text-primary">Upload a photo</p>
                    <p className="text-xs text-text-secondary">JPG or PNG</p>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="sr-only" onChange={handleImage} />
            </label>
            {errors.image && <p className="text-sm text-danger">{errors.image}</p>}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Tell the story</h2>
            <Input
              label="Product name"
              name="productName"
              value={form.productName}
              onChange={(e) => setField("productName", e.target.value)}
              error={errors.productName}
              placeholder="e.g. Hand-thrown ceramic mug"
            />
            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              error={errors.description}
              hint="What makes it special? Materials, process, inspiration."
              placeholder="I made this on my wheel using stoneware clay…"
              rows={5}
            />
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              error={errors.category}
            >
              <option value="">Choose a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <Input
              label="Tags"
              name="tags"
              value={form.tags}
              onChange={(e) => setField("tags", e.target.value)}
              hint="Comma-separated: handmade, gift, ceramic"
              placeholder="handmade, unique, gift"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Set your price</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Price (USD)"
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                error={errors.price}
                placeholder="29.99"
              />
              <Input
                label="Compare-at price (optional)"
                type="number"
                step="0.01"
                name="originalPrice"
                value={form.originalPrice}
                onChange={(e) => setField("originalPrice", e.target.value)}
                hint="Shows a sale badge if higher than your price"
                placeholder="39.99"
              />
            </div>
            <Input
              label="How many can you make?"
              type="number"
              name="stock"
              value={form.stock}
              onChange={(e) => setField("stock", e.target.value)}
              error={errors.stock}
              placeholder="10"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Ready to go live?</h2>
            <div className="flex gap-4 rounded-xl border border-border bg-bg-muted p-4">
              {preview && (
                <img src={preview} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              )}
              <div className="min-w-0 space-y-2">
                <p className="font-semibold text-text-primary">{form.productName}</p>
                <p className="line-clamp-2 text-sm text-text-secondary">{form.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="accent">{categoryLabel}</Badge>
                  <Badge variant="warm">${form.price}</Badge>
                  <Badge>{form.stock} in stock</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              By listing, you confirm this is handmade by you and accurately described.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={goNext}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Publishing…" : "Publish listing"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Sell;
