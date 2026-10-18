import type { JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { LetterAnalysis } from "@/lib/letter";
import { resultMessages } from "./messages";

/** Shown when the letter may be fake; "likely" is drawn as a strong red alert. */
export function ScamWarning({ scam }: { scam: LetterAnalysis["scam"] }): JSX.Element | null {
  const t = useT(resultMessages);
  if (scam.level === "none") return null;
  const likely = scam.level === "likely";

  return (
    <section
      role={likely ? "alert" : undefined}
      className={`rounded-2xl border-2 p-5 shadow-sm ${likely ? "border-red-600 bg-red-600 text-white" : "border-amber-500 bg-amber-50 text-amber-950"}`}
    >
      <h2 className="flex items-center gap-3 text-xl font-bold">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4M12 17h.01" />
        </svg>
        {likely ? t("scamLikely") : t("scamPossible")}
      </h2>
      {scam.reasons.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 ps-6 text-lg">
          {scam.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
      <p className={`mt-3 text-lg font-semibold ${likely ? "" : "text-amber-950"}`}>{t("scamAdvice")}</p>
    </section>
  );
}
