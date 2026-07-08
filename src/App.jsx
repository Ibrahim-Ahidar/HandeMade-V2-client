import HomeRoute from "./components/HomeRoute";
import Products from "./pages/products";
import ProductDetail from "./pages/productDetail";
import Seller from "./pages/seller";
import Profile from "./pages/profile";
import Admin from "./pages/admin";
import Sell from "./pages/sell";
import Contact from "./pages/contact";
import Cart from "./pages/cart";
import About from "./pages/about";
import NotFound from "./pages/notFound";
import { CartProvider } from "./hooks/CartContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";
import { AppShell } from "./components/layout";
import { ToastProvider } from "./components/ui";
import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import VerifyCode from "./pages/verify-code.jsx";
import VerifySignupCode from "./pages/verify-signup-code.jsx";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RequireEmail from "./components/RequireEmail.jsx";
import RequireSignupEmail from "./components/RequireSignupEmail.jsx";
import RequireResetToken from "./components/RequireResetToken.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import BlockAdminFromMarketplace from "./components/BlockAdminFromMarketplace.jsx";
import RedirectIfAuth from "./components/RedirectIfAuth.jsx";
import { useAuth } from "./providers/AuthProvider.jsx";
import { RecoveryProvider } from "./providers/RecoveryProvider.jsx";

function App() {
  const auth = useAuth();

  if (auth.status === "loading") {
    return <Loader />;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <RecoveryProvider>
              <ScrollToTop />
              <Routes>
                {/* Auth — no shell */}
                <Route element={<RedirectIfAuth />}>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>
                <Route element={<RequireEmail />}>
                  <Route path="/verify-code" element={<VerifyCode />} />
                </Route>
                <Route element={<RequireSignupEmail />}>
                  <Route path="/verify-signup-code" element={<VerifySignupCode />} />
                </Route>
                <Route element={<RequireResetToken />}>
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* App shell */}
                <Route element={<AppShell />}>
                  <Route path="/" element={<HomeRoute />} />
                  <Route path="/Home" element={<HomeRoute />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  <Route element={<RequireAuth />}>
                    <Route element={<RequireAdmin />}>
                      <Route path="/admin" element={<Admin />} />
                    </Route>
                    <Route element={<BlockAdminFromMarketplace />}>
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/sell" element={<Sell />} />
                      <Route path="/seller" element={<Seller />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </RecoveryProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
