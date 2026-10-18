"use client";

import { useEffect, useRef, useId, type ChangeEvent, type JSX, type ReactNode } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { scanMessages } from "./messages";
import type { FlowError } from "./useLetterFlow";

type Props = {
  error: FlowError | null;
  onFile: (file: File) => void;
  /** Present when the last upload can simply be sent again. */
  onRetry: (() => void) | null;
};

/** Home action area: photograph or upload a letter, plus the error message of the last attempt. */
export function ScanScreen({ error, onFile, onRetry }: Props): JSX.Element {
  const t = useT(scanMessages);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires a change event.
    event.target.value = "";
    if (file) onFile(file);
  }

  return (
    <section aria-labelledby="scan-heading" className="flex flex-col gap-5">
      <div>
        <h1 id="scan-heading" className="text-3xl font-bold leading-tight tracking-tight">
          {t("heading")}
        </h1>
        <p className="mt-2 text-lg text-stone-700">{t("intro")}</p>
      </div>

      {error && <ErrorCard error={error} onRetry={onRetry} />}

      <div className="flex flex-col gap-3">
        <FileButton
          variant="primary"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          icon={<CameraIcon />}
          label={t("takePhoto")}
        />
        <FileButton
          variant="secondary"
          accept="image/*,application/pdf"
          onChange={handleChange}
          icon={<UploadIcon />}
          label={t("upload")}
        />
      </div>

      <p className="text-base text-stone-600">{t("photoTip")}</p>

      <p className="flex items-center gap-2 text-base font-medium text-stone-700">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        {t("privacy")}
      </p>
    </section>
  );
}

function FileButton({
  variant,
  accept,
  capture,
  onChange,
  icon,
  label,
}: {
  variant: "primary" | "secondary";
  accept: string;
  capture?: "environment";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  icon: ReactNode;
  label: string;
}) {
  const id = useId();
  const style =
    variant === "primary"
      ? "min-h-20 bg-blue-700 text-2xl text-white shadow-md hover:bg-blue-800"
      : "min-h-16 border-2 border-blue-700 bg-white text-xl text-blue-700 hover:bg-blue-50";
  return (
    <label
      htmlFor={id}
      className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl px-6 py-4 font-semibold transition-colors has-[input:focus-visible]:outline-4 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-blue-300 ${style}`}
    >
      {icon}
      {label}
      <input id={id} type="file" accept={accept} capture={capture} onChange={onChange} className="sr-only" />
    </label>
  );
}

function ErrorCard({ error, onRetry }: { error: FlowError; onRetry: (() => void) | null }) {
  const t = useT(scanMessages);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [error]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="rounded-2xl border-2 border-red-600 bg-red-50 p-5 text-red-900 outline-none"
    >
      <p className="flex items-center gap-2 text-xl font-bold">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 16.5h.01" />
        </svg>
        {t("errorTitle")}
      </p>
      <p className="mt-2 text-lg">{t(`err_${error}`)}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-red-700 px-5 py-2 text-lg font-semibold text-white hover:bg-red-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-red-300"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5" />
          </svg>
          {t("retry")}
        </button>
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15V4M7 9l5-5 5 5M5 15v4h14v-4" />
    </svg>
  );
}
