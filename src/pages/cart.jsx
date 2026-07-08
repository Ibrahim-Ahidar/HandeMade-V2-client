import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/CartContext";
import { formatPrice } from "../utils/formatPrice";
import {
  Button,
  Card,
  EmptyState,
  Modal,
  PageHeader,
  useToast,
} from "../components/ui";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const itemCount = cart.reduce((n, item) => n + item.quantity, 0);
  const subtotal = getCartTotal();

  const handleQuantityChange = useCallback(
    (productId, newQuantity, maxStock) => {
      const quantity = parseInt(newQuantity, 10);
      if (Number.isNaN(quantity) || quantity < 1) return;
      updateQuantity(productId, Math.min(quantity, maxStock));
    },
    [updateQuantity]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    setShowClearConfirm(false);
    toast("Cart cleared", "info");
  }, [clearCart, toast]);

  const handleCheckout = useCallback(() => {
    setShowCheckout(true);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Discover handmade pieces from artisans around the world."
          actionLabel="Browse marketplace"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <PageHeader
        title="Your cart"
        description={`${itemCount} item${itemCount !== 1 ? "s" : ""}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(true)}>
            Clear cart
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover ring-1 ring-border transition hover:opacity-90"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="line-clamp-2 font-semibold text-text-primary hover:text-accent"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">
                        by {item.artisan?.name ?? "Artisan"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 text-text-secondary transition hover:text-danger"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock || 999}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value, item.stock || 999)
                        }
                        className="w-14 rounded-lg border border-border bg-bg-elevated px-2 py-1 text-center text-sm"
                        aria-label="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.stock ? item.quantity >= item.stock : false}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="text-lg font-semibold text-text-primary">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-success">Calculated at checkout</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-base font-semibold text-text-primary">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" className="mt-6 w-full" onClick={handleCheckout}>
              Checkout
            </Button>
            <Button to="/products" variant="ghost" size="sm" className="mt-3 w-full">
              Continue shopping
            </Button>

            <p className="mt-6 text-center text-xs text-text-secondary">
              Secure payments powered by Stripe — coming soon
            </p>
          </Card>
        </div>
      </div>

      <Modal open={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear cart?">
        <p className="text-sm text-text-secondary">
          Remove all items from your cart? This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleClearCart}>
            Clear cart
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={showCheckout} onClose={() => setShowCheckout(false)} title="Checkout">
        <p className="text-sm text-text-secondary">
          Payments are coming soon. Your cart is saved locally — we&apos;ll notify you when checkout
          goes live.
        </p>
        <Button variant="primary" className="mt-6 w-full" onClick={() => setShowCheckout(false)}>
          Got it
        </Button>
      </Modal>
    </div>
  );
}
