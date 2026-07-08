import { useState } from "react";

import { Link } from "react-router-dom";

import { login as loginService, GoogleLogin as GoogleLoginService } from "../services/auth";

import { useAuth } from "../providers/AuthProvider";

import { usePostAuthNavigate } from "../hooks/usePostAuthNavigate";

import AuthLayout from "../components/layout/AuthLayout";

import GoogleAuthButton from "../components/features/GoogleAuthButton";

import { Button, Input, useToast } from "../components/ui";



const authInputClass = "py-2.5";



export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const goAfterAuth = usePostAuthNavigate();

  const { setAuthenticated } = useAuth();

  const { toast } = useToast();



  const handleLogin = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    try {

      const data = await loginService({ email, password });
      setAuthenticated(data.accessToken ?? data.token, data.user);
      goAfterAuth(data.user);

    } catch (err) {

      const msg = err?.message ?? err?.error ?? "Invalid email or password";

      toast(typeof msg === "string" ? msg : "Login failed", "error");

    } finally {

      setSubmitting(false);

    }

  };



  const handleGoogleLogin = async (res) => {

    try {

      const data = await GoogleLoginService(res);
      setAuthenticated(data.accessToken ?? data.token, data.user);
      goAfterAuth(data.user);

    } catch {

      toast("Google sign-in failed", "error");

    }

  };



  return (

    <AuthLayout

      title="Welcome back"

      subtitle="Sign in to browse and manage your shop."

      footer={

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs sm:text-sm">

          <Link to="/Home" className="text-text-secondary transition hover:text-accent">

            ← Home

          </Link>

          <div className="flex flex-wrap gap-x-3 gap-y-1">

            <Link to="/forgot-password" className="text-text-secondary transition hover:text-accent">

              Forgot password?

            </Link>

            <Link to="/signup" className="font-medium text-accent transition hover:underline">

              Create account

            </Link>

          </div>

        </div>

      }

    >

      <GoogleAuthButton compact onSuccess={handleGoogleLogin} onError={() => toast("Google sign-in failed", "error")} />



      <div className="my-4 flex items-center gap-2.5">

        <div className="h-px flex-1 bg-border" />

        <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">or</span>

        <div className="h-px flex-1 bg-border" />

      </div>



      <form className="space-y-3" onSubmit={handleLogin}>

        <Input
          label="Email"
          type="email"
          name="email"
          compact
          value={email}

          onChange={(e) => setEmail(e.target.value.trim())}

          placeholder="you@email.com"

          autoComplete="email"

          className={authInputClass}

        />

        <Input
          label="Password"
          type="password"
          name="password"
          compact
          value={password}

          onChange={(e) => setPassword(e.target.value)}

          placeholder="Your password"

          autoComplete="current-password"

          className={authInputClass}

        />

        <Button type="submit" variant="warm" size="md" className="mt-1 min-h-10 w-full" disabled={submitting}>

          {submitting ? "Signing in…" : "Log in"}

        </Button>

      </form>

    </AuthLayout>

  );

}

