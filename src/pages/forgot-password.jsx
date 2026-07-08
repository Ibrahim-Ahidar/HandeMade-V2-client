import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/auth";
import { useRecovery } from "../providers/RecoveryProvider";
import AuthLayout from "../components/layout/AuthLayout";
import { Button, Input, useToast } from "../components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setEmail: setRecoveryEmail } = useRecovery();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setRecoveryEmail(email.trim());
    navigate("/verify-code");

    try {
      await forgotPassword(email.trim());
    } catch (err) {
      console.error(err);
      toast("If an account exists, a code was sent.", "info");
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="We'll email you a 6-digit recovery code."
      narrow
      showHero={false}
      centered
      footer={
        <Link to="/login" className="text-xs text-text-secondary transition hover:text-accent sm:text-sm">
          ← Back to login
        </Link>
      }
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          compact
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          placeholder="you@email.com"
          autoComplete="email"
          className="py-2.5"
        />
        <Button type="submit" variant="warm" size="md" className="min-h-10 w-full">
          Send recovery code
        </Button>
      </form>
    </AuthLayout>
  );
}
