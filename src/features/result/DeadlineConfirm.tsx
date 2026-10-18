import { useId, useState, type JSX } from "react";
import { AddDeadlineActions } from "@/features/deadlines/AddDeadlineActions";
import { useT } from "@/i18n/LanguageProvider";
import type { LetterAnalysis } from "@/lib/letter";
import { formatAmount, parseIsoDate } from "./format";
import { resultMessages } from "./messages";

/**
 * Lets the user check (and correct) the deadline before it goes into the calendar.
 * Without a detected deadline the user may still enter a date manually.
 */
export function DeadlineConfirm({ analysis }: { analysis: LetterAnalysis }): JSX.Element {
  const t = useT(resultMessages);
  const inputId = useId();
  const { deadline } = analysis;
  const [date, setDate] = useState(deadline?.date ?? "");
  const isValid = parseIsoDate(date) !== null;

  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      className="flex flex-col gap-4 rounded-2xl border-2 border-blue-700 bg-white p-5 shadow-sm"
    >
      {deadline ? (
        <div>
          <h2 id={`${inputId}-heading`} className="text-xl font-bold">
            {t("confirmHeading")}
          </h2>
          <p className="mt-1 text-lg text-stone-700">{t("confirmHint")}</p>
        </div>
      ) : (
        <div>
          <h2 id={`${inputId}-heading`} className="text-xl font-bold">
            {t("noDeadline")}
          </h2>
          <p className="mt-1 text-lg text-stone-700">{t("manualDateHint")}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-lg font-semibold">
          {deadline ? t("dateLabel") : t("manualDateLabel")}
        </label>
        <input
          id={inputId}
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="min-h-14 w-full rounded-xl border-2 border-stone-300 bg-white px-4 text-xl text-stone-900 focus:border-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        />
      </div>

      {isValid && (
        <AddDeadlineActions
          title={analysis.title}
          sender={analysis.sender}
          date={date}
          description={deadline?.description ?? analysis.title}
          reference={analysis.reference?.value ?? null}
          amount={analysis.amount ? formatAmount(analysis.amount.value, analysis.amount.currency, "de") : null}
        />
      )}
    </section>
  );
}
