import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner" />
      <span className="loader-label">HandeMade</span>
    </div>
  );
}