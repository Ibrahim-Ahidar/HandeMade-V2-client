import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyCode } from "../services/auth";
import { useRecovery } from "../providers/RecoveryProvider";
import AuthLayout from "../components/layout/AuthLayout";
import { Button, useToast } from "../components/ui";
import { cn } from "../utils/cn";

function getErrorMessage(err) {
  return err?.response?.data?.message ?? err?.message ?? "Invalid or expired code";
}

export default function VerifyCode() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef([]);
  const navigate = useNavigate();
  const { setResetToken, email } = useRecovery();
  const { toast } = useToast();

  const filled = code.every((c) => c !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyCode(email, code.join(""));
      setResetToken(data.data.resetToken);
      navigate("/reset-password");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, i) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") return;
    e.preventDefault();
    const next = [...code];
    if (e.key === "Backspace") {
      next[i] = "";
      setCode(next);
      if (i > 0) refs.current[i - 1]?.focus();
      return;
    }
    next[i] = e.key;
    setCode(next);
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    setCode(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-accent">{email}</span>.
        </>
      }
      narrow
      showHero={false}
      centered
      footer={
        <Link to="/forgot-password" className="text-xs text-text-secondary transition hover:text-accent sm:text-sm">
          ← Use a different email
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={() => {}}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-11 w-full max-w-[44px] rounded-lg border text-center text-base font-semibold outline-none transition sm:h-12 sm:max-w-[48px]",
                digit
                  ? "border-accent bg-accent/5 text-text-primary"
                  : "border-border bg-bg-elevated focus:border-accent focus:ring-2 focus:ring-accent/20"
              )}
            />
          ))}
        </div>
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="warm" size="md" className="min-h-10 w-full" disabled={!filled || loading}>
          {loading ? "Verifying…" : "Verify code"}
        </Button>
      </form>
    </AuthLayout>
  );
}
