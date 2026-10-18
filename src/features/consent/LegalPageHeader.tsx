"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { consentMessages } from "./messages";

/** Header for the German-only legal pages: way back, language switch and a short note in the user's language. */
export function LegalPageHeader(): JSX.Element {
  const { language } = useLanguage();
  const t = useT(consentMessages);

  return (
    <header className="mx-auto max-w-xl px-4 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center font-semibold text-blue-700 underline underline-offset-4">
          {t("back")}
        </Link>
        <LanguageSwitcher />
      </div>
      {language !== null && (
        <p className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">{t("legalPageNote")}</p>
      )}
    </header>
  );
}
