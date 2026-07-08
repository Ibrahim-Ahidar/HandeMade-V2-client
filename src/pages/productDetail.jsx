import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../api/products";
import { reviews } from "../data/products";
import { useCart } from "../hooks/CartContext";
import {
  ImageGallery,
  ProductCard,
} from "../components/features";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  EmptyState,
  PageHeader,
  PriceTag,
  RatingStars,
  Skeleton,
  useToast,
} from "../components/ui";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getProductById(id), getProducts()])
      .then(([p, all]) => {
        if (!mounted) return;
        setProduct(p);
        setAllProducts(all);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const productReviews = reviews[id] || [];

  const artisanProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.artisan.id === product.artisan.id && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, quantity);
    toast(`Added ${quantity} × ${product.name} to cart`, "success");
  }, [product, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback(
    (delta) => {
      if (!product) return;
      setQuantity((q) => Math.min(Math.max(1, q + delta), product.stock));
    },
    [product]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Skeleton className="mb-6 h-4 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <EmptyState
          title="Product not found"
          description="This listing may have been removed or the link is incorrect."
          actionLabel="Browse marketplace"
          actionTo="/products"
        />
      </div>
    );
  }

  const stockBadge =
    product.stock === 0
      ? { label: "Out of stock", variant: "danger" }
      : product.stock <= 5
        ? { label: `Only ${product.stock} left`, variant: "warm" }
        : { label: "In stock", variant: "success" };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/Home" },
          { label: "Products", to: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="flex-1 font-serif text-3xl font-semibold text-text-primary md:text-4xl">
              {product.name}
            </h1>
            <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="lg" />
          </div>

          <div className="mt-6">
            <PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" />
          </div>

          <p className="mt-6 leading-relaxed text-text-secondary">{product.longDescription}</p>

          <Card className="mt-6 space-y-3 p-4 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-text-primary">Dimensions</span>
              <span className="text-text-secondary">{product.dimensions}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-medium text-text-primary">Materials</span>
              <span className="text-right text-text-secondary">{product.materials}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-text-primary">Made by</span>
              <span className="font-script text-lg text-accent-warm">{product.artisan.name}</span>
            </div>
          </Card>

          <Card className="mt-6 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Artisan</p>
            <div className="mt-3 flex items-start gap-4">
              <img
                src={product.artisan.avatar}
                alt={product.artisan.name}
                className="h-14 w-14 rounded-full ring-2 ring-border"
              />
              <div>
                <p className="font-semibold text-text-primary">{product.artisan.name}</p>
                <p className="mt-1 text-sm text-text-secondary">{product.artisan.bio}</p>
                <p className="mt-1 text-xs text-text-secondary">{product.artisan.location}</p>
              </div>
            </div>
          </Card>

          {product.stock > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-text-primary">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-primary transition hover:bg-bg-muted disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-primary transition hover:bg-bg-muted disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0
                ? "Out of stock"
                : isInCart(product.id)
                  ? "Add more to cart"
                  : "Add to cart"}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/cart")}>
              View cart
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {productReviews.length > 0 && (
        <section className="mt-16">
          <PageHeader title="Customer reviews" />
          <div className="space-y-4">
            {productReviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-text-primary">{review.userName}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-sm text-text-secondary">{review.comment}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {artisanProducts.length > 0 && (
        <section className="mt-16">
          <PageHeader
            title={`More from ${product.artisan.name}`}
            description="Other handmade pieces from the same artisan."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {artisanProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
