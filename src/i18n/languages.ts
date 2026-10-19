/**
 * Languages offered for explanations and the UI.
 * "de" means Leichte Sprache (plain German) — the original letter is German anyway.
 */
export const LANGUAGES = ["ar", "uk", "tr", "en", "de"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_INFO: Record<
  Language,
  { nativeName: string; dir: "rtl" | "ltr"; speechLang: string; promptName: string }
> = {
  ar: { nativeName: "العربية", dir: "rtl", speechLang: "ar-SA", promptName: "Arabic (Modern Standard Arabic, simple words)" },
  uk: { nativeName: "Українська", dir: "ltr", speechLang: "uk-UA", promptName: "Ukrainian" },
  tr: { nativeName: "Türkçe", dir: "ltr", speechLang: "tr-TR", promptName: "Turkish" },
  en: { nativeName: "English", dir: "ltr", speechLang: "en-US", promptName: "simple English" },
  de: { nativeName: "Leichte Sprache", dir: "ltr", speechLang: "de-DE", promptName: "German in Leichte Sprache (very short sentences, everyday words)" },
};

export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

/** Per-feature message tables: every language must define every key. */
export type Messages<K extends string> = Record<Language, Record<K, string>>;
