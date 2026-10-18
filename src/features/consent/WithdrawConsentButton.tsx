"use client";

import { useState, type JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { useConsent, withdrawConsent } from "./consentStore";
import { consentMessages } from "./messages";

/** Withdrawing consent must be as easy as giving it (GDPR Art. 7 (3)). Renders nothing if no consent is stored. */
export function WithdrawConsentButton(): JSX.Element | null {
  const consent = useConsent();
  const t = useT(consentMessages);
  const [withdrawn, setWithdrawn] = useState(false);

  if (withdrawn) {
    return (
      <p role="status" className="font-medium">
        {t("withdrawn")}
      </p>
    );
  }
  if (!consent) return null;
  return (
    <button
      type="button"
      onClick={() => {
        withdrawConsent();
        setWithdrawn(true);
      }}
      className="min-h-12 rounded-2xl border-2 border-blue-700 bg-white px-5 font-semibold text-blue-700 hover:bg-blue-50"
    >
      {t("withdraw")}
    </button>
  );
}
