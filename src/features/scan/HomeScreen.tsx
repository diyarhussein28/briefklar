"use client";

import type { JSX } from "react";
import { LanguageSwitcher } from "@/features/consent/LanguageSwitcher";
import { DeadlineList } from "@/features/deadlines/DeadlineList";
import { ResultView } from "@/features/result/ResultView";
import { useT } from "@/i18n/LanguageProvider";
import { AnalyzingView } from "./AnalyzingView";
import { scanMessages } from "./messages";
import { ScanScreen } from "./ScanScreen";
import { useLetterFlow } from "./useLetterFlow";

/** The BriefKlar home: header, then scan → analyzing → result. */
export function HomeScreen(): JSX.Element {
  const t = useT(scanMessages);
  const { state, submit, retry, reset } = useLetterFlow();

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <div>
            <p className="text-xl font-bold leading-tight tracking-tight text-blue-800" lang="de" dir="ltr">
              BriefKlar
            </p>
            <p className="text-sm text-stone-600">{t("tagline")}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="flex flex-col gap-8 pt-2">
        {state.phase === "analyzing" && <AnalyzingView />}
        {state.phase === "result" && <ResultView analysis={state.analysis} onReset={reset} />}
        {(state.phase === "idle" || state.phase === "error") && (
          <>
            <ScanScreen error={state.phase === "error" ? state.error : null} onFile={submit} onRetry={retry} />
            <DeadlineList compact />
          </>
        )}
      </main>
    </div>
  );
}
