import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

// Only downloaded when Arabic text is on the page (unicode-range), so no preload for everyone else.
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "BriefKlar – Behördenbriefe verstehen",
    template: "%s – BriefKlar",
  },
  description:
    "Brief fotografieren, in Ihrer Sprache verstehen: BriefKlar erklärt Behördenbriefe auf Arabisch, Ukrainisch, Türkisch, Englisch und in Leichter Sprache – mit Frist, Betrag und kostenloser Beratung in der Nähe.",
  applicationName: "BriefKlar",
  appleWebApp: {
    capable: true,
    title: "BriefKlar",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // LanguageProvider updates lang/dir on <html> once the user has picked a language.
    <html lang="de" className={`${notoSans.variable} ${notoSansArabic.variable}`}>
      <body className="flex min-h-dvh flex-col bg-stone-50 text-stone-900 antialiased">
        <LanguageProvider>
          <div className="flex-1">{children}</div>
          <footer className="mx-auto w-full max-w-xl px-4 py-6 text-sm text-stone-600" lang="de" dir="ltr">
            <nav aria-label="Rechtliches" className="flex flex-wrap justify-center gap-x-6">
              <Link href="/datenschutz" className="inline-flex min-h-12 items-center underline underline-offset-4 hover:text-stone-900">
                Datenschutz
              </Link>
              <Link href="/impressum" className="inline-flex min-h-12 items-center underline underline-offset-4 hover:text-stone-900">
                Impressum
              </Link>
            </nav>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
