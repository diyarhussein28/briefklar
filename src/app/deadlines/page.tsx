"use client";

import Link from "next/link";
import { useT } from "@/i18n/LanguageProvider";
import { DeadlineList } from "@/features/deadlines/DeadlineList";
import { deadlineMessages } from "@/features/deadlines/messages";

// Client page: deadlines and the language choice exist only in this browser's localStorage.
export default function DeadlinesPage() {
  const t = useT(deadlineMessages);
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 text-lg">
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-2 self-start font-semibold text-blue-700 underline underline-offset-4"
      >
        <span aria-hidden="true" className="inline-block rtl:rotate-180">
          ←
        </span>
        {t("back")}
      </Link>
      <h1 className="text-3xl font-bold text-stone-900">{t("heading")}</h1>
      <DeadlineList />
    </main>
  );
}
