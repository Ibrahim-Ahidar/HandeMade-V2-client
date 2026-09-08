export const MARKETING_PATHS = ["/", "/Home", "/about", "/contact"];

export const AUTH_PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-code",
  "/verify-signup-code",
  "/reset-password",
];

/** Routes that must not render until a session is confirmed or rejected. */
export function isSessionGatedPath(pathname) {
  if (MARKETING_PATHS.includes(pathname) || AUTH_PUBLIC_PATHS.includes(pathname)) {
    return false;
  }
  return (
    pathname === "/products" ||
    pathname === "/cart" ||
    pathname === "/sell" ||
    pathname === "/seller" ||
    pathname === "/profile" ||
    pathname === "/admin" ||
    pathname.startsWith("/product/")
  );
}

export const guestNavLinks = [
  { to: "/Home", hash: "#discover", labelKey: "nav.discover" },
  { to: "/Home", hash: "#sell", labelKey: "nav.sell" },
  { to: "/Home", hash: "#how-it-works", labelKey: "nav.howItWorks" },
  { to: "/about", labelKey: "nav.about" },
];

export const appNavLinks = [
  { to: "/products", labelKey: "nav.products" },
  { to: "/sell", labelKey: "nav.sell" },
  { to: "/seller", labelKey: "nav.dashboard" },
  { to: "/contact", labelKey: "nav.contact" },
];

export const adminNavLinks = [{ to: "/admin", labelKey: "nav.dashboard" }];

export const DEFAULT_AUTH_REDIRECT = "/products";
export const DEFAULT_ADMIN_REDIRECT = "/admin";

export function getAuthRedirectPath(user, from) {
  if (user?.role === "admin") return DEFAULT_ADMIN_REDIRECT;
  if (from && from !== "/login" && from !== "/signup") return from;
  return DEFAULT_AUTH_REDIRECT;
}

export const appCommandActions = [
  { id: "products", label: "Browse Products", path: "/products", keywords: "shop marketplace" },
  { id: "sell", label: "Sell a Product", path: "/sell", keywords: "list create" },
  { id: "seller", label: "Seller Dashboard", path: "/seller", keywords: "analytics stats" },
  { id: "contact", label: "Contact Support", path: "/contact", keywords: "help email support" },
  { id: "cart", label: "Go to Cart", path: "/cart", keywords: "checkout bag" },
  { id: "profile", label: "Your Profile", path: "/profile", keywords: "account settings shop" },
];

export const adminCommandActions = [
  {
    id: "admin",
    label: "Admin Dashboard",
    path: "/admin",
    keywords: "admin users products manage dashboard",
  },
];

export const guestFooterMarketplace = [
  { to: "/Home#discover", labelKey: "nav.discover" },
  { to: "/Home#sell", labelKey: "nav.sell" },
];

export const guestFooterLearn = [
  { to: "/Home#how-it-works", labelKey: "footer.howItWorks" },
  { to: "/Home#faq", labelKey: "footer.faq" },
  { to: "/about", labelKey: "nav.about" },
];

export const guestFooterAccount = [
  { to: "/login", labelKey: "nav.login" },
  { to: "/signup", labelKey: "nav.signup" },
  { to: "/contact", labelKey: "nav.contact" },
];
