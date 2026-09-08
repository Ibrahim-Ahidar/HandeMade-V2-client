/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  dictionaries,
  translate,
} from "../i18n";

const I18nContext = createContext(null);

function readStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "en" || stored === "ar" ? stored : DEFAULT_LANGUAGE;
}

function i18nReducer(state, action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return action.language === "en" || action.language === "ar"
        ? { language: action.language }
        : state;
    case "TOGGLE_LANGUAGE":
      return { language: state.language === "ar" ? "en" : "ar" };
    default:
      return state;
  }
}

export function I18nProvider({ children }) {
  const [state, dispatch] = useReducer(i18nReducer, null, () => ({
    language: readStoredLanguage(),
  }));

  const { language } = state;
  const dir = language === "ar" ? "rtl" : "ltr";
  const locale = language === "ar" ? "ar" : "en-US";
  const messages = dictionaries[language];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = dir;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, dir]);

  const t = useCallback(
    (key, vars) => translate(messages, key, vars),
    [messages]
  );

  const setLanguage = useCallback((next) => {
    dispatch({ type: "SET_LANGUAGE", language: next });
  }, []);

  const toggleLanguage = useCallback(() => {
    dispatch({ type: "TOGGLE_LANGUAGE" });
  }, []);

  const value = useMemo(
    () => ({
      language,
      dir,
      locale,
      messages,
      t,
      setLanguage,
      toggleLanguage,
    }),
    [language, dir, locale, messages, t, setLanguage, toggleLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
