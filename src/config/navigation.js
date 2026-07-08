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

export const guestFooterExplore = [
  { to: "/Home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const guestFooterAccount = [
  { to: "/login", label: "Log in" },
  { to: "/signup", label: "Sign up" },
];
