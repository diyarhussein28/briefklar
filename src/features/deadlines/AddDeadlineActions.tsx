"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { downloadDeadlineIcs } from "./ics";
import { deadlineMessages } from "./messages";
import { formatDay, reminderDates } from "./reminders";
import { addDeadline, useDeadlines } from "./store";

type Props = {
  title: string;
  sender: string | null;
  date: string;
  description: string;
  reference: string | null;
  amount: string | null;
};

const buttonBase =
  "flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-5 py-3 text-lg font-semibold transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300";

export function AddDeadlineActions(props: Props): JSX.Element {
  const t = useT(deadlineMessages);
  const lang = useLanguage().language ?? "de";
  const deadlines = useDeadlines();
  const [error, setError] = useState<string | null>(null);

  const isSaved = deadlines.some((d) => d.date === props.date && d.title === props.title);
  const reminders = reminderDates(props.date).map((date) =>
    formatDay(date, lang, { weekday: "short", day: "numeric", month: "short" }),
  );

  function handleCalendar() {
    setError(null);
    try {
      downloadDeadlineIcs(props, lang);
    } catch (err) {
      console.error(err);
      setError(t("calendarError"));
    }
  }

  function handleSave() {
    setError(null);
    try {
      addDeadline(props);
    } catch (err) {
      console.error(err);
      setError(t("saveError"));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={handleCalendar} className={`${buttonBase} bg-blue-700 text-white hover:bg-blue-800`}>
        <CalendarIcon />
        {t("addToCalendar")}
      </button>

      {isSaved ? (
        <div role="status" className="rounded-2xl border-2 border-green-600 bg-green-50 p-4 text-lg text-green-800">
          <p className="flex items-center gap-2 font-semibold">
            <span aria-hidden="true">✓</span>
            {t("saved")}
          </p>
          <Link
            href="/deadlines"
            className="mt-2 inline-flex min-h-12 items-center font-semibold text-blue-700 underline underline-offset-4"
          >
            {t("showDeadlines")}
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          className={`${buttonBase} border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-50`}
        >
          <BellIcon />
          {t("saveReminder")}
        </button>
      )}

      <p className="text-base text-stone-600">
        {t("remindersOn")} {reminders.join(" · ")}
      </p>

      {error && (
        <p role="alert" className="rounded-2xl border-2 border-red-600 bg-red-50 p-3 text-lg text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Z" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}
