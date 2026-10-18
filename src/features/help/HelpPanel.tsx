"use client";

import { useId, useState, useSyncExternalStore, type JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { HelpTopic } from "@/lib/letter";
import { helpMessages } from "./messages";
import { ORGANIZATIONS } from "./organizations";
import { bundeslandForPostcode, isValidPostcode } from "./postcode";

const STORAGE_KEY = "briefklar.plz";
const DEFAULT_TOPICS: HelpTopic[] = ["sozialberatung", "verbraucherzentrale"];

function readStoredPlz(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value && isValidPostcode(value) ? value : null;
  } catch {
    return null;
  }
}

function storePlz(plz: string) {
  try {
    localStorage.setItem(STORAGE_KEY, plz);
  } catch {
    // Storage unavailable (private mode): the postcode is not remembered.
  }
}

const noSubscription = () => () => {};

export function HelpPanel({ topics }: { topics: HelpTopic[] }): JSX.Element {
  const t = useT(helpMessages);
  const inputId = useId();
  const errorId = useId();
  const storedPlz = useSyncExternalStore(noSubscription, readStoredPlz, () => null);
  // null until the user types; until then the remembered postcode is shown.
  const [typed, setTyped] = useState<string | null>(null);
  const [blurred, setBlurred] = useState(false);

  const value = typed ?? storedPlz ?? "";
  const plz = isValidPostcode(value) ? value : null;
  const bundesland = plz ? bundeslandForPostcode(plz) : null;
  const showInvalid = value !== "" && !plz && (value.length === 5 || blurred);
  const shownTopics = topics.length > 0 ? topics : DEFAULT_TOPICS;

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 5);
    setTyped(digits);
    setBlurred(false);
    if (isValidPostcode(digits)) storePlz(digits);
  }

  return (
    <section className="space-y-4 text-lg">
      <h2 className="text-2xl font-bold text-stone-900">{t("title")}</h2>

      <div className="space-y-2">
        <label htmlFor={inputId} className="block font-medium text-stone-800">
          {t("plzLabel")}
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[0-9]*"
          maxLength={5}
          dir="ltr"
          value={value}
          placeholder={t("plzPlaceholder")}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={() => setBlurred(true)}
          aria-invalid={showInvalid}
          aria-describedby={showInvalid ? errorId : undefined}
          className="min-h-12 w-40 rounded-xl border-2 border-stone-300 bg-white px-4 text-start text-xl tracking-widest focus:border-blue-700 focus:outline-none"
        />
        {showInvalid && (
          <p id={errorId} className="text-red-700">
            {t("plzInvalid")}
          </p>
        )}
      </div>

      <ul className="space-y-4">
        {shownTopics.map((topic) => {
          const organization = ORGANIZATIONS[topic];
          return (
            <li key={topic} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 lang="de" className="text-xl font-semibold text-stone-900">
                {organization.name}
              </h3>
              <p className="text-stone-700">{t(organization.explanationKey)}</p>
              <a
                href={organization.searchUrl(plz, bundesland)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                {t("open")}
                <span aria-hidden="true" className="inline-block rtl:-scale-x-100">↗</span>
                <span className="sr-only">({t("newTab")})</span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="rounded-2xl border border-stone-200 bg-stone-100 p-4 text-base text-stone-700">{t("disclaimer")}</p>
    </section>
  );
}
