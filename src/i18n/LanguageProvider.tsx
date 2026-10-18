"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { LANGUAGE_INFO, isLanguage, type Language, type Messages } from "./languages";

const STORAGE_KEY = "briefklar.language";
const listeners = new Set<() => void>();

function readStored(): Language | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type LanguageContextValue = {
  /** null until the user has picked a language (or during SSR). */
  language: Language | null;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, readStored, () => null);

  const setLanguage = useCallback((next: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page view only.
    }
    listeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    const info = LANGUAGE_INFO[language ?? "de"];
    document.documentElement.lang = language ?? "de";
    document.documentElement.dir = info.dir;
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return value;
}

/** Returns a translator for a feature's message table, using the current language (German until chosen). */
export function useT<K extends string>(messages: Messages<K>): (key: K) => string {
  const { language } = useLanguage();
  const table = messages[language ?? "de"];
  return useCallback((key: K) => table[key], [table]);
}
