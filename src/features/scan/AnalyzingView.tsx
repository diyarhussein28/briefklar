"use client";

import { useEffect, useState, type JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { scanMessages } from "./messages";

const STEPS = ["progress1", "progress2", "progress3", "progress4"] as const;
const STEP_MS = 4000;

/** Calm progress screen while the letter is analysed (10–30 s). Steps advance on a timer and stop at the last one. */
export function AnalyzingView(): JSX.Element {
  const t = useT(scanMessages);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((current) => Math.min(current + 1, STEPS.length - 1)), STEP_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section aria-busy="true" className="flex flex-col items-center gap-6 rounded-2xl border border-stone-200 bg-white px-5 py-10 text-center shadow-sm">
      <svg aria-hidden="true" viewBox="0 0 48 48" className="size-16 text-blue-700 motion-safe:animate-spin">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={5} />
        <path d="M24 4a20 20 0 0 1 20 20" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      </svg>

      <p role="status" aria-live="polite" className="text-2xl font-bold">
        {t(STEPS[step])}
      </p>

      <ol className="flex w-full max-w-xs flex-col gap-2 text-start text-lg" aria-hidden="true">
        {STEPS.map((key, index) => (
          <li key={key} className={`flex items-center gap-3 ${index <= step ? "text-stone-900" : "text-stone-400"}`}>
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                index < step ? "border-green-600 bg-green-600 text-white" : index === step ? "border-blue-700" : "border-stone-300"
              }`}
            >
              {index < step && (
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              )}
            </span>
            {t(key)}
          </li>
        ))}
      </ol>

      <p className="text-base text-stone-600">{t("progressHint")}</p>
    </section>
  );
}
