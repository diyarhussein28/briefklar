import type { JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import type { Urgency } from "@/lib/letter";
import { resultMessages } from "./messages";

const STYLES: Record<Urgency, { box: string; badge: string }> = {
  red: { box: "border-red-600 bg-red-50 text-red-900", badge: "bg-red-600" },
  yellow: { box: "border-amber-500 bg-amber-50 text-amber-950", badge: "bg-amber-500" },
  green: { box: "border-green-600 bg-green-50 text-green-900", badge: "bg-green-600" },
};

type Props = { urgency: Urgency; reason: string };

export function UrgencyBanner({ urgency, reason }: Props): JSX.Element {
  const t = useT(resultMessages);
  const style = STYLES[urgency];
  return (
    <section className={`flex items-start gap-4 rounded-2xl border-2 border-s-8 p-5 shadow-sm ${style.box}`}>
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-full text-white ${style.badge}`}>
        <UrgencyIcon urgency={urgency} />
      </span>
      <div>
        <p className="text-2xl font-bold">{t(`urgency_${urgency}`)}</p>
        <p className="mt-1 text-lg">{reason}</p>
      </div>
    </section>
  );
}

function UrgencyIcon({ urgency }: { urgency: Urgency }) {
  const common = { "aria-hidden": true, viewBox: "0 0 24 24", className: "size-7", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (urgency === "red") {
    return (
      <svg {...common}>
        <path d="M12 7v6M12 17h.01" />
      </svg>
    );
  }
  if (urgency === "yellow") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 11v6M12 7h.01" />
    </svg>
  );
}
