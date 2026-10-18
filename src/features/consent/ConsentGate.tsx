"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type JSX, type ReactNode } from "react";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { LANGUAGES, LANGUAGE_INFO, type Language } from "@/i18n/languages";
import { giveConsent, useConsent } from "./consentStore";
import { consentMessages, PICKER_PROMPTS } from "./messages";

/**
 * Shows the language picker, then the AI disclosure (AI Act Art. 50) and the explicit consent
 * for special-category data (GDPR Art. 9 (2)(a)), and only then the app itself.
 */
export function ConsentGate({ children }: { children: ReactNode }): JSX.Element {
  const { language, setLanguage } = useLanguage();
  const consent = useConsent();
  const [pickingLanguage, setPickingLanguage] = useState(false);

  // Server render and hydration: language and consent live in localStorage, so stay neutral.
  if (consent === null) return <LoadingScreen />;

  if (language === null || pickingLanguage) {
    return (
      <LanguagePicker
        onPick={(next) => {
          setLanguage(next);
          setPickingLanguage(false);
        }}
      />
    );
  }

  if (!consent) return <ConsentScreen onChangeLanguage={() => setPickingLanguage(true)} />;

  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" aria-busy="true">
      <span className="text-2xl font-bold tracking-tight text-blue-700 motion-safe:animate-pulse" lang="de">
        BriefKlar
      </span>
    </div>
  );
}

function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}

function LanguagePicker({ onPick }: { onPick: (language: Language) => void }) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="text-center">
        <p className="text-3xl font-bold tracking-tight text-blue-700" lang="de">
          BriefKlar
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-semibold outline-none" lang="de">
          Willkommen! Behördenbriefe verstehen – in Ihrer Sprache.
        </h1>
        <ul className="mt-3 space-y-1 text-stone-600">
          {PICKER_PROMPTS.map(({ language, text }) => (
            <li key={language} lang={language} dir={LANGUAGE_INFO[language].dir}>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-8 space-y-3">
        {LANGUAGES.map((code) => (
          <li key={code}>
            <button
              type="button"
              onClick={() => onPick(code)}
              lang={code}
              dir={LANGUAGE_INFO[code].dir}
              className="flex min-h-16 w-full items-center justify-center rounded-2xl border-2 border-blue-700 bg-white px-6 py-3 text-2xl font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              {LANGUAGE_INFO[code].nativeName}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function ConsentScreen({ onChangeLanguage }: { onChangeLanguage: () => void }) {
  const t = useT(consentMessages);
  const [checked, setChecked] = useState(false);
  const checkboxId = useId();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none">
        {t("title")}
      </h1>

      <div className="mt-6 space-y-4">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{t("aiTitle")}</h2>
          <p className="mt-2">{t("aiText")}</p>
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{t("dataTitle")}</h2>
          <p className="mt-2">{t("dataText")}</p>
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">{t("legalTitle")}</h2>
          <p className="mt-2">{t("legalText")}</p>
        </section>
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-2xl border-2 border-blue-700 bg-white p-5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="mt-1 size-7 shrink-0 accent-blue-700"
        />
        <label htmlFor={checkboxId} className="font-medium">
          {t("checkbox")}
        </label>
      </div>

      <p className="mt-4">
        <Link href="/datenschutz" className="inline-flex min-h-12 items-center text-blue-700 underline underline-offset-4">
          {t("privacyLink")}
        </Link>
      </p>

      <button
        type="button"
        disabled={!checked}
        onClick={giveConsent}
        className="mt-4 min-h-14 w-full rounded-2xl bg-blue-700 px-6 text-xl font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-700"
      >
        {t("continue")}
      </button>

      <button
        type="button"
        onClick={onChangeLanguage}
        className="mt-3 min-h-12 w-full rounded-2xl text-blue-700 underline underline-offset-4"
      >
        {t("changeLanguage")}
      </button>
    </main>
  );
}
