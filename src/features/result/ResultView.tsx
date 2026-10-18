"use client";

import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { HelpPanel } from "@/features/help/HelpPanel";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { LANGUAGE_INFO } from "@/i18n/languages";
import type { LetterAnalysis } from "@/lib/letter";
import { DeadlineConfirm } from "./DeadlineConfirm";
import { highlightSegments } from "./highlight";
import { KeyFacts } from "./KeyFacts";
import { resultMessages } from "./messages";
import { NextSteps } from "./NextSteps";
import { OriginalLetter } from "./OriginalLetter";
import { quoteElementId, quotesOf, type QuoteId } from "./quotes";
import { ReadAloudButton } from "./ReadAloudButton";
import { ScamWarning } from "./ScamWarning";
import { UrgencyBanner } from "./UrgencyBanner";

type Props = { analysis: LetterAnalysis; onReset: () => void };

/** The explained letter: urgency → summary → facts → confirm deadline → steps → help → original. */
export function ResultView({ analysis, onReset }: Props): JSX.Element {
  const t = useT(resultMessages);
  const language = useLanguage().language ?? "de";
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState<QuoteId | null>(null);

  const segments = useMemo(() => highlightSegments(analysis.transcript, quotesOf(analysis)), [analysis]);
  const foundQuotes = useMemo(
    () => new Set(segments.flatMap((segment) => (segment.highlightId ? [segment.highlightId as QuoteId] : []))),
    [segments],
  );

  // A new result replaces the progress screen: start reading from the top.
  useEffect(() => {
    document.scrollingElement?.scrollTo?.({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  function showInLetter(id: QuoteId) {
    setLetterOpen(true);
    setActiveQuote(id);
    // Wait for the <details> to open before scrolling to the mark.
    requestAnimationFrame(() => {
      const mark = document.getElementById(quoteElementId(id));
      mark?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      mark?.focus({ preventScroll: true });
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <UrgencyBanner urgency={analysis.urgency} reason={analysis.urgencyReason} />

      <ScamWarning scam={analysis.scam} />

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-base font-semibold uppercase tracking-wide text-stone-600">{t("inShort")}</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-bold leading-snug outline-none">
          {analysis.title}
        </h1>
        <div className="mt-4 flex flex-col gap-3 text-xl leading-relaxed">
          {analysis.summary.map((sentence, index) => (
            <p key={index}>{sentence}</p>
          ))}
        </div>
        <div className="mt-5">
          <ReadAloudButton sentences={[analysis.title, ...analysis.summary]} speechLang={LANGUAGE_INFO[language].speechLang} />
        </div>
      </section>

      <KeyFacts analysis={analysis} foundQuotes={foundQuotes} onShowInLetter={showInLetter} />

      <DeadlineConfirm analysis={analysis} />

      <NextSteps steps={analysis.steps} />

      <HelpPanel topics={analysis.helpTopics} />

      <OriginalLetter segments={segments} open={letterOpen} onOpenChange={setLetterOpen} activeQuote={activeQuote} />

      <footer className="flex flex-col gap-4 pt-2">
        <p className="flex items-start gap-2 text-base text-stone-600">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          {t("aiDisclosure")}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-blue-700 px-6 py-3 text-xl font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          {t("scanAnother")}
        </button>
      </footer>
    </div>
  );
}
