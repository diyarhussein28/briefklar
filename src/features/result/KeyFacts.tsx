import { useState, type JSX, type ReactNode } from "react";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import type { LetterAnalysis } from "@/lib/letter";
import { daysUntil, formatAmount, formatDate, formatRelativeDays } from "./format";
import type { QuoteId } from "./quotes";
import { resultMessages } from "./messages";

type Props = {
  analysis: LetterAnalysis;
  /** Quotes that were found in the transcript (only these get a "Show in letter" button). */
  foundQuotes: ReadonlySet<QuoteId>;
  onShowInLetter: (id: QuoteId) => void;
};

/** Deadline, amount, reference and sender as large, scannable cards. */
export function KeyFacts({ analysis, foundQuotes, onShowInLetter }: Props): JSX.Element | null {
  const t = useT(resultMessages);
  const language = useLanguage().language ?? "de";
  const { deadline, amount, reference, sender, letterDate } = analysis;
  if (!deadline && !amount && !reference && !sender) return null;

  const showButton = (id: QuoteId) =>
    foundQuotes.has(id) ? <ShowInLetterButton onClick={() => onShowInLetter(id)} label={t("showInLetter")} /> : null;

  const days = deadline ? daysUntil(deadline.date, new Date()) : null;

  return (
    <section aria-labelledby="facts-heading" className="flex flex-col gap-3">
      <h2 id="facts-heading" className="text-xl font-bold">
        {t("factsHeading")}
      </h2>

      {deadline && (
        <FactCard icon={<CalendarIcon />} label={t("deadline")} action={showButton("deadline")} tone={days !== null && days < 0 ? "danger" : "default"}>
          <p className="text-2xl font-bold">{formatDate(deadline.date, language)}</p>
          {days !== null && (
            <p className={`mt-1 text-lg font-semibold ${days < 0 ? "text-red-700" : "text-blue-800"}`}>
              {days < 0 ? t("overdue") : formatRelativeDays(days, language)}
            </p>
          )}
          <p className="mt-2 text-lg">{deadline.description}</p>
          {deadline.isEstimated && (
            <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-base text-amber-950">{t("estimated")}</p>
          )}
        </FactCard>
      )}

      {amount && (
        <FactCard icon={<EuroIcon />} label={t("amount")} action={showButton("amount")}>
          <p className="text-2xl font-bold" dir="ltr">
            {formatAmount(amount.value, amount.currency, language)}
          </p>
          <p className="mt-2 text-lg">{amount.description}</p>
        </FactCard>
      )}

      {reference && (
        <FactCard
          icon={<HashIcon />}
          label={t("reference")}
          action={
            <>
              <CopyButton value={reference.value} />
              {showButton("reference")}
            </>
          }
        >
          <p className="text-base text-stone-600" lang="de">
            {reference.label}
          </p>
          <p className="break-all font-mono text-2xl font-bold" dir="ltr">
            {reference.value}
          </p>
        </FactCard>
      )}

      {sender && (
        <FactCard icon={<BuildingIcon />} label={t("sender")} action={showButton("sender")}>
          <p className="text-xl font-bold" lang="de" dir="auto">
            {sender}
          </p>
          {letterDate && (
            <p className="mt-1 text-base text-stone-600">
              {t("letterDate")} {formatDate(letterDate, language)}
            </p>
          )}
        </FactCard>
      )}
    </section>
  );
}

function FactCard({
  icon,
  label,
  action,
  tone = "default",
  children,
}: {
  icon: ReactNode;
  label: string;
  action: ReactNode;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${tone === "danger" ? "border-red-300" : "border-stone-200"}`}
    >
      <p className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-stone-600">
        <span className="text-blue-700">{icon}</span>
        {label}
      </p>
      <div className="mt-2">{children}</div>
      {action && <div className="mt-4 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

const smallButton =
  "inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-blue-700 bg-white px-4 py-2 text-base font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300";

function ShowInLetterButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={smallButton}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.5-4.5" />
      </svg>
      {label}
    </button>
  );
}

function CopyButton({ value }: { value: string }) {
  const t = useT(resultMessages);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the value is still visible and selectable.
    }
  }

  return (
    <button type="button" onClick={copy} className={smallButton}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {copied ? <path d="m5 12 5 5 9-10" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
      </svg>
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "size-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function CalendarIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function EuroIcon() {
  return (
    <svg {...iconProps}>
      <path d="M17 6.5A6.5 6.5 0 1 0 17 17.5M4 10h9M4 14h9" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
    </svg>
  );
}
