import type { JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { resultMessages } from "./messages";

/** "What can I do now?" — general, non-personal steps as a numbered list. */
export function NextSteps({ steps }: { steps: string[] }): JSX.Element | null {
  const t = useT(resultMessages);
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="steps-heading" className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 id="steps-heading" className="text-xl font-bold">
        {t("stepsHeading")}
      </h2>
      <ol className="mt-4 flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white"
            >
              {index + 1}
            </span>
            <span className="pt-1 text-lg">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
