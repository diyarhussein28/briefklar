import type { Language } from "@/i18n/languages";

/** Days before the deadline on which the user is reminded. */
export const REMINDER_DAYS_BEFORE = [7, 3, 1] as const;

export type DeadlineStatus = "overdue" | "today" | "soon" | "later";

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" → [year, month (1-12), day]. Throws for malformed or non-existent dates. */
export function parseIsoDate(date: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const parts: [number, number, number] | null = match
    ? [Number(match[1]), Number(match[2]), Number(match[3])]
    : null;
  if (!parts || new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date "${date}", expected YYYY-MM-DD`);
  }
  return parts;
}

/** Calendar date as a UTC timestamp at midnight, so day arithmetic ignores time zones and DST. */
function toUtcDay(date: string): number {
  const [year, month, day] = parseIsoDate(date);
  return Date.UTC(year, month - 1, day);
}

function toIsoDate(utcDay: number): string {
  return new Date(utcDay).toISOString().slice(0, 10);
}

/** Whole calendar days from `today` (local date) until `date`. Negative when the date has passed. */
export function daysUntil(date: string, today: Date): number {
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((toUtcDay(date) - todayUtc) / DAY_MS);
}

/** The reminder dates (7, 3 and 1 day before the deadline) as YYYY-MM-DD. */
export function reminderDates(date: string): string[] {
  const deadline = toUtcDay(date);
  return REMINDER_DAYS_BEFORE.map((days) => toIsoDate(deadline - days * DAY_MS));
}

export function deadlineStatus(date: string, today: Date): DeadlineStatus {
  const days = daysUntil(date, today);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 7) return "soon";
  return "later";
}

/** Locales for Intl formatting. Latin digits for Arabic, so dates match the German letter. */
const INTL_LOCALE: Record<Language, string> = {
  ar: "ar-u-nu-latn",
  uk: "uk-UA",
  tr: "tr-TR",
  en: "en-GB",
  de: "de-DE",
};

/** Formats a YYYY-MM-DD date for display, e.g. "Mo., 3. November 2026". */
export function formatDay(
  date: string,
  lang: Language,
  options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "long", year: "numeric" },
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { ...options, timeZone: "UTC" }).format(toUtcDay(date));
}

/** "today", "tomorrow", "in 5 days", "3 days ago" — correctly pluralised for each language. */
export function formatRelativeDays(days: number, lang: Language): string {
  return new Intl.RelativeTimeFormat(INTL_LOCALE[lang], { numeric: "auto" }).format(days, "day");
}
