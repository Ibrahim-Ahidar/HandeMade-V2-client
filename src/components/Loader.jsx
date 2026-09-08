import { memo } from "react";
import "../styles/Loader.css";

function Loader({ message = "HandeMade", hint }) {
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="loader-card">
        <div className="spinner" />
        <span className="loader-label">{message}</span>
        {hint ? <span className="loader-hint">{hint}</span> : null}
      </div>
    </div>
  );
}

export default memo(Loader);
