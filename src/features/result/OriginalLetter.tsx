import type { JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { Segment } from "./highlight";
import { quoteElementId, type QuoteId } from "./quotes";
import { resultMessages } from "./messages";

type Props = {
  segments: Segment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The quote the user just jumped to; drawn stronger. */
  activeQuote: QuoteId | null;
};

/** The transcript in German, collapsible, with every backed-up fact marked. */
export function OriginalLetter({ segments, open, onOpenChange, activeQuote }: Props): JSX.Element {
  const t = useT(resultMessages);
  const anchored = new Set<string>();

  return (
    <details
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
      className="group rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-3 text-lg font-semibold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3h7l5 5v13H7z" />
            <path d="M14 3v5h5M10 13h6M10 17h6" />
          </svg>
          {t("originalHeading")}
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="border-t border-stone-200 px-5 pb-5 pt-4">
        <p className="mb-3 text-base text-stone-600">{t("originalHint")}</p>
        <div dir="ltr" lang="de" className="whitespace-pre-wrap break-words text-start text-base leading-relaxed text-stone-800">
          {segments.map((segment, index) => {
            if (!segment.highlightId) return <span key={index}>{segment.text}</span>;
            const id = segment.highlightId as QuoteId;
            // The first mark of each quote is the scroll target for "Show in letter".
            const isAnchor = !anchored.has(id);
            anchored.add(id);
            return (
              <mark
                key={index}
                id={isAnchor ? quoteElementId(id) : undefined}
                tabIndex={isAnchor ? -1 : undefined}
                className={`scroll-my-24 rounded px-0.5 text-stone-900 outline-none transition-colors ${
                  activeQuote === id ? "bg-amber-300 ring-2 ring-amber-500" : "bg-yellow-200"
                }`}
              >
                {segment.text}
              </mark>
            );
          })}
        </div>
      </div>
    </details>
  );
}
