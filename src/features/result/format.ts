import type { Language } from "@/i18n/languages";

/** Intl locale per UI language. Arabic uses Latin digits so numbers match the German letter. */
const LOCALES: Record<Language, string> = {
  ar: "ar-u-nu-latn",
  uk: "uk-UA",
  tr: "tr-TR",
  en: "en-GB",
  de: "de-DE",
};

export const localeFor = (language: Language) => LOCALES[language];

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses YYYY-MM-DD to a UTC timestamp, or null when it is not a real calendar date. */
export function parseIsoDate(iso: string): number | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? time : null;
}

export function formatDate(iso: string, language: Language): string {
  const time = parseIsoDate(iso);
  if (time === null) return iso;
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(time);
}

/** Calendar days from `today` (local date) until the ISO date; negative when it has passed. */
export function daysUntil(iso: string, today: Date): number | null {
  const time = parseIsoDate(iso);
  if (time === null) return null;
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((time - todayUtc) / 86_400_000);
}

/** "in 5 days", "tomorrow", "today" — correctly pluralised by the browser. */
export function formatRelativeDays(days: number, language: Language): string {
  return new Intl.RelativeTimeFormat(localeFor(language), { numeric: "auto" }).format(days, "day");
}

export function formatAmount(value: number, currency: string, language: Language): string {
  try {
    return new Intl.NumberFormat(localeFor(language), { style: "currency", currency }).format(value);
  } catch {
    // Not an ISO currency code (e.g. "€"): show it as written.
    return `${value} ${currency}`;
  }
}
