import { memo, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useBusy } from "../context/BusyContext";
import { useI18n } from "../context/I18nContext";
import { isSessionGatedPath } from "../config/navigation";
import Loader from "./Loader";

const SLOW_HINT_MS = 4000;

function AppOverlay() {
  const { status, sessionHint } = useAuth();
  const { active, message } = useBusy();
  const { t } = useI18n();
  const location = useLocation();
  const [slow, setSlow] = useState(false);

  const waitingOnSession =
    status === "loading" && (sessionHint || isSessionGatedPath(location.pathname));
  const visible = active || waitingOnSession;

  useEffect(() => {
    if (!visible) {
      setSlow(false);
      return undefined;
    }

    const id = window.setTimeout(() => setSlow(true), SLOW_HINT_MS);
    return () => window.clearTimeout(id);
  }, [visible]);

  const label = useMemo(() => {
    if (active && message) return message;
    if (waitingOnSession && sessionHint) return t("loader.openingStudio");
    if (waitingOnSession) return t("loader.connecting");
    return t("loader.working");
  }, [active, message, waitingOnSession, sessionHint, t]);

  if (!visible) return null;

  return <Loader message={label} hint={slow ? t("loader.waking") : null} />;
}

export default memo(AppOverlay);
