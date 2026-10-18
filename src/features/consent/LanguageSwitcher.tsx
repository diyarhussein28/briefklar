"use client";

import { useId, type JSX } from "react";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { LANGUAGES, LANGUAGE_INFO, isLanguage } from "@/i18n/languages";
import { consentMessages } from "./messages";

/** Compact language selector (native names), e.g. for page headers. */
export function LanguageSwitcher(): JSX.Element {
  const { language, setLanguage } = useLanguage();
  const t = useT(consentMessages);
  const id = useId();

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-stone-600">
        {t("languageLabel")}
      </label>
      <select
        id={id}
        value={language ?? ""}
        onChange={(event) => {
          if (isLanguage(event.target.value)) setLanguage(event.target.value);
        }}
        className="min-h-12 rounded-xl border-2 border-stone-300 bg-white px-3 text-base text-stone-900"
      >
        {language === null && (
          <option value="" disabled>
            —
          </option>
        )}
        {LANGUAGES.map((code) => (
          <option key={code} value={code} lang={code}>
            {LANGUAGE_INFO[code].nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
