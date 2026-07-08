import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/CartContext";
import { cn } from "../../utils/cn";
import { Avatar, Badge, Button, Card, PriceTag, RatingStars } from "../ui";

function ProductCard({ product, className }) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleCartAction = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (inCart) removeFromCart(product.id);
      else addToCart(product);
    },
    [inCart, product, addToCart, removeFromCart]
  );

  return (
    <Card
      as={Link}
      to={`/product/${product.id}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]",
        className
      )}
    >
      <div className="relative aspect-square shrink-0 overflow-hidden bg-bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {product.originalPrice && (
          <Badge variant="danger" className="absolute right-2 top-2">
            Sale
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute left-2 top-2" variant="default">
            Sold out
          </Badge>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <Badge className="absolute left-2 top-2" variant="warm">
            {product.stock} left
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[2.5rem]">
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </div>

        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-text-secondary sm:block hidden">
          {product.description}
        </p>

        <div className="mt-3 flex min-h-8 items-center gap-2">
          <Avatar src={product.artisan.avatar} name={product.artisan.name} size="sm" />
          <span className="truncate text-xs text-text-secondary">{product.artisan.name}</span>
        </div>

        <div className="mt-3 flex min-h-6 items-end justify-between gap-2">
          <PriceTag price={product.price} originalPrice={product.originalPrice} size="sm" />
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-auto pt-4">
          <Button
            variant={inCart ? "secondary" : "primary"}
            size="sm"
            className="w-full"
            onClick={handleCartAction}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of stock" : inCart ? "Remove from cart" : "Add to cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(ProductCard);
