import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { I18nProvider } from "./context/I18nContext.jsx";
import { wakeBackend } from "./api/wake.js";

wakeBackend();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
