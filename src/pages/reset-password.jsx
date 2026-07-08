import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecovery } from "../providers/RecoveryProvider";
import { resetPassword } from "../services/auth";
import AuthLayout from "../components/layout/AuthLayout";
import { Button, Input, useToast } from "../components/ui";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { resetToken, setEmail, setResetToken, setLoading } = useRecovery();
  const { toast } = useToast();

  const valid = password.length >= 8 && password === confirm;
  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    try {
      setLoading(true);
      await resetPassword(resetToken, password);
      toast("Password updated. You can log in now.", "success");
      navigate("/login");
      setTimeout(() => {
        setEmail(null);
        setResetToken(null);
      }, 0);
    } catch {
      toast("Could not reset password. Try again.", "error");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Use at least 8 characters you'll remember."
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
          label="New password"
          type="password"
          compact
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          className="py-2.5"
        />
        <Input
          label="Confirm password"
          type="password"
          compact
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={mismatch ? "Passwords do not match" : undefined}
          placeholder="Repeat password"
          autoComplete="new-password"
          className="py-2.5"
        />
        <Button type="submit" variant="warm" size="md" className="min-h-10 w-full" disabled={!valid || submitting}>
          {submitting ? "Saving…" : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
