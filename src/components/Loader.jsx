import { memo } from "react";
import "../styles/Loader.css";

function Loader({ message, hint }) {
  const showText = Boolean(message || hint);

  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      {showText ? (
        <div className="loader-copy">
          {message ? <span className="loader-label">{message}</span> : null}
          {hint ? <span className="loader-hint">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export default memo(Loader);
