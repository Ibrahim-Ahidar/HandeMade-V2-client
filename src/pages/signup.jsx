import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup as signupService, GoogleSignup as GoogleSignupService } from "../services/auth";
import { useAuth } from "../providers/AuthProvider";
import { useRecovery } from "../providers/RecoveryProvider";
import { usePostAuthNavigate } from "../hooks/usePostAuthNavigate";
import { useBusy } from "../context/BusyContext";
import { useI18n } from "../context/I18nContext";
import AuthLayout from "../components/layout/AuthLayout";
import GoogleAuthButton from "../components/features/GoogleAuthButton";
import { Button, Input, useToast } from "../components/ui";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const usernameRegex = /^[a-z0-9_ ]{3,20}$/;
const authInputClass = "py-2.5";

export default function Signup() {
  const navigate = useNavigate();
  const goAfterAuth = usePostAuthNavigate();
  const { setAuthenticated } = useAuth();
  const { setEmail, clearRecovery } = useRecovery();
  const { startBusy, stopBusy } = useBusy();
  const { t } = useI18n();
  const { toast } = useToast();

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    const email = form.email.trim().toLowerCase();

    if (!email) next.email = "Email is required";
    else if (!emailRegex.test(email)) next.email = "Enter a valid email";

    const username = form.username.trim();
    if (!username) next.username = "Username is required";
    else if (!usernameRegex.test(username)) next.username = "3–20 chars: letters, numbers, underscore";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "At least 6 characters";

    return next;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const email = form.email.trim().toLowerCase();
    const username = form.username.trim().toLowerCase();
    const password = form.password.trim();

    setSubmitting(true);
    startBusy(t("loader.sendingCode"));
    try {
      clearRecovery();
      await signupService({ email, username, password });
      setEmail(email);
      navigate("/verify-signup-code");
    } catch (err) {
      const message = (err?.message ?? err?.error ?? "").toString().toLowerCase();

      if (message.includes("email") && message.includes("username")) {
        setErrors({ email: "Already registered", username: "Already taken" });
      } else if (message.includes("email")) {
        setErrors({ email: "Email already registered" });
      } else if (message.includes("username")) {
        setErrors({ username: "Username already taken" });
      } else {
        toast("Could not send verification code. Try again.", "error");
      }
    } finally {
      setSubmitting(false);
      stopBusy();
    }
  };

  const handleGoogleSignup = async (res) => {
    startBusy(t("loader.creatingAccount"));
    try {
      const data = await GoogleSignupService(res);
      setAuthenticated(data.accessToken ?? data.token, data.user);
      goAfterAuth(data.user);
    } catch {
      toast("Google sign-up failed", "error");
    } finally {
      stopBusy();
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs sm:text-sm">
          <Link to="/Home" className="text-text-secondary transition hover:text-accent">
            ← Home
          </Link>
          <Link to="/login" className="text-text-secondary transition hover:text-accent">
            Have an account?<span className="font-medium text-accent">Log in</span>
          </Link>
        </div>
      }
    >
      <GoogleAuthButton compact onSuccess={handleGoogleSignup} label="Sign up with Google" />

      <div className="my-3.5 flex items-center gap-2.5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-2.5" onSubmit={handleSignup}>
        <Input
          label="Email"
          name="email"
          compact
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@email.com"
          autoComplete="email"
          className={authInputClass}
        />
        <Input
          label="Username"
          name="username"
          compact
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="your_shop_name"
          autoComplete="username"
          className={authInputClass}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          compact
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          className={authInputClass}
        />
        <Button type="submit" variant="warm" size="md" className="mt-1 min-h-10 w-full" disabled={submitting}>
          {submitting ? "Sending code…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
