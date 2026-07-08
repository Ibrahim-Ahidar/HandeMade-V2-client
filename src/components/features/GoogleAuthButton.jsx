import { memo } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { cn } from "../../utils/cn";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.2-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1L31.8 34C29.8 35.6 27 36.5 24 36.5c-5.2 0-9.7-3.3-11.3-8l-6.6 5.1C9.7 39.7 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.7 5.2C41.6 35 44 30 44 24c0-1.2-.1-2.2-.4-3.5z" />
    </svg>
  );
}

function GoogleAuthButton({ onSuccess, onError, label = "Continue with Google", compact = false, className }) {
  const triggerGoogle = () => {
    const googleBtn = document.querySelector('[data-google-login="true"] div[role="button"]');
    googleBtn?.click();
  };

  return (
    <>
      <div className="sr-only" data-google-login="true" aria-hidden="true">
        <GoogleLogin onSuccess={onSuccess} onError={onError ?? (() => {})} />
      </div>
      <button
        type="button"
        onClick={triggerGoogle}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-bg-elevated px-4 text-sm font-medium text-text-primary shadow-sm transition hover:bg-bg-muted active:scale-[0.99]",
          compact ? "py-2.5" : "py-3 hover:scale-[1.01]",
          className
        )}
      >
        <GoogleIcon />
        {label}
      </button>
    </>
  );
}

export default memo(GoogleAuthButton);
