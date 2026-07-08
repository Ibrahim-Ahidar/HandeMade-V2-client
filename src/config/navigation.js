export const MARKETING_PATHS = ["/Home", "/about", "/contact"];

export const guestNavLinks = [
  { to: "/Home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const appNavLinks = [
  { to: "/products", label: "Products" },
  { to: "/sell", label: "Sell" },
  { to: "/seller", label: "Dashboard" },
  { to: "/contact", label: "Contact" },
];

export const adminNavLinks = [{ to: "/admin", label: "Dashboard" }];

export const MARKETPLACE_PATH_PREFIXES = [
  "/products",
  "/product/",
  "/cart",
  "/sell",
  "/seller",
  "/profile",
  "/contact",
];

export const DEFAULT_AUTH_REDIRECT = "/products";
export const DEFAULT_ADMIN_REDIRECT = "/admin";

export function isMarketplacePath(path) {
  if (!path) return false;
  return MARKETPLACE_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix)
  );
}

export function getAuthRedirectPath(user, from) {
  if (user?.role === "admin") return DEFAULT_ADMIN_REDIRECT;
  if (from && from !== "/login" && from !== "/signup") return from;
  return DEFAULT_AUTH_REDIRECT;
}

export const guestCommandActions = [
  { id: "home", label: "Go to Home", path: "/Home", keywords: "home landing" },
  { id: "about", label: "About HandeMade", path: "/about", keywords: "story mission" },
  { id: "contact", label: "Contact Us", path: "/contact", keywords: "support help" },
  { id: "login", label: "Log in", path: "/login", keywords: "sign in auth" },
  { id: "signup", label: "Sign up", path: "/signup", keywords: "register create account" },
];

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

export const guestFooterExplore = [
  { to: "/Home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const guestFooterAccount = [
  { to: "/login", label: "Log in" },
  { to: "/signup", label: "Sign up" },
];
