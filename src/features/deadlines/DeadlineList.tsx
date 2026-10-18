"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import type { Language } from "@/i18n/languages";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { downloadDeadlineIcs } from "./ics";
import { deadlineMessages, type DeadlineMessageKey } from "./messages";
import { daysUntil, deadlineStatus, formatDay, formatRelativeDays, type DeadlineStatus } from "./reminders";
import { removeDeadline, setDone, useDeadlines } from "./store";
import type { SavedDeadline } from "./types";

const COMPACT_COUNT = 3;

const BADGE_STYLE: Record<DeadlineStatus, string> = {
  overdue: "border-red-600 bg-red-50 text-red-700",
  today: "border-red-600 bg-red-50 text-red-700",
  soon: "border-amber-500 bg-amber-50 text-amber-800",
  later: "border-green-600 bg-green-50 text-green-700",
};

const actionButton =
  "inline-flex min-h-12 items-center justify-center rounded-2xl px-4 py-2 text-base font-semibold transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300";

type T = (key: DeadlineMessageKey) => string;

export function DeadlineList({ compact = false }: { compact?: boolean }): JSX.Element | null {
  const t = useT(deadlineMessages);
  const lang = useLanguage().language ?? "de";
  const deadlines = useDeadlines();

  const open = deadlines.filter((d) => !d.done);
  const done = deadlines.filter((d) => d.done);

  if (compact) {
    if (open.length === 0) return null;
    // Only computed when there are items, i.e. on the client after hydration (never during prerender).
    const today = new Date();
    return (
      <section aria-labelledby="upcoming-deadlines" className="flex flex-col gap-3">
        <h2 id="upcoming-deadlines" className="text-xl font-bold text-stone-900">
          {t("upcoming")}
        </h2>
        <ul className="flex flex-col gap-3">
          {open.slice(0, COMPACT_COUNT).map((d) => (
            <DeadlineItem key={d.id} deadline={d} today={today} lang={lang} t={t} compact />
          ))}
        </ul>
        <Link
          href="/deadlines"
          className="inline-flex min-h-12 items-center self-start text-lg font-semibold text-blue-700 underline underline-offset-4"
        >
          {t("showAll")}
        </Link>
      </section>
    );
  }

  if (deadlines.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xl font-semibold text-stone-900">{t("emptyTitle")}</p>
        <p className="mt-2 text-lg text-stone-600">{t("emptyText")}</p>
      </div>
    );
  }

  const today = new Date();
  return (
    <div className="flex flex-col gap-6">
      {open.length > 0 && (
        <ul className="flex flex-col gap-3">
          {open.map((d) => (
            <DeadlineItem key={d.id} deadline={d} today={today} lang={lang} t={t} />
          ))}
        </ul>
      )}
      {done.length > 0 && (
        <section aria-labelledby="done-deadlines" className="flex flex-col gap-3">
          <h2 id="done-deadlines" className="text-xl font-bold text-stone-700">
            {t("doneSection")}
          </h2>
          <ul className="flex flex-col gap-3">
            {done.map((d) => (
              <DeadlineItem key={d.id} deadline={d} today={today} lang={lang} t={t} />
            ))}
          </ul>
        </section>
      )}
      <p className="text-base text-stone-600">🔒 {t("privacyNote")}</p>
    </div>
  );
}

function DeadlineItem({
  deadline,
  today,
  lang,
  t,
  compact = false,
}: {
  deadline: SavedDeadline;
  today: Date;
  lang: Language;
  t: T;
  compact?: boolean;
}) {
  const [error, setError] = useState(false);
  const days = daysUntil(deadline.date, today);
  const status = deadlineStatus(deadline.date, today);

  function handleCalendar() {
    setError(false);
    try {
      downloadDeadlineIcs(deadline, lang);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }

  function handleDelete() {
    if (window.confirm(t("confirmDelete"))) removeDeadline(deadline.id);
  }

  return (
    <li
      className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm ${deadline.done ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-lg font-semibold break-words text-stone-900 ${deadline.done ? "line-through" : ""}`}>
            {deadline.title}
          </p>
          {deadline.sender && <p className="text-base break-words text-stone-600">{deadline.sender}</p>}
          <p className="text-base text-stone-800">
            {formatDay(deadline.date, lang)}
            {deadline.amount && <span className="font-semibold"> · {deadline.amount}</span>}
          </p>
        </div>
        {deadline.done ? (
          <span className="shrink-0 rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-base font-semibold text-stone-700">
            ✓ {t("markDone")}
          </span>
        ) : (
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-center text-base font-semibold ${BADGE_STYLE[status]}`}
          >
            {status === "overdue" ? t("overdue") : formatRelativeDays(days, lang)}
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDone(deadline.id, !deadline.done)}
            className={`${actionButton} border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-50`}
          >
            {deadline.done ? t("markOpen") : `✓ ${t("markDone")}`}
          </button>
          {!deadline.done && (
            <button
              type="button"
              onClick={handleCalendar}
              className={`${actionButton} border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-50`}
            >
              {t("addToCalendar")}
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className={`${actionButton} ms-auto border-2 border-red-600 bg-white text-red-700 hover:bg-red-50`}
          >
            {t("delete")}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-base text-red-700">
          {t("calendarError")}
        </p>
      )}
    </li>
  );
}
