import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { strings } from "./strings.js";

const STORAGE_KEY = "dep-lang";
const LanguageContext = createContext(null);

function readInitialLang() {
  if (typeof window === "undefined") return "id";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "id" ? stored : "id";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next === "en" ? "en" : "id");
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const t = useCallback((key) => strings[lang][key] ?? strings.id[key] ?? key, [lang]);

  const pick = useCallback(
    (field) => {
      if (!field) return { text: "", isFallback: false };
      const primary = field[lang];
      if (primary && primary.trim().length > 0) {
        return { text: primary, isFallback: false };
      }
      const other = lang === "id" ? "en" : "id";
      return { text: field[other] ?? "", isFallback: true };
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t, pick }), [lang, setLang, toggleLang, t, pick]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
