import type { Metadata } from "next";
import { LegalPageHeader } from "@/features/consent/LegalPageHeader";

export const metadata: Metadata = {
  title: "Impressum",
};

const h2 = "mt-8 text-xl font-semibold";
const p = "mt-3";

export default function ImpressumPage() {
  return (
    <>
      <LegalPageHeader />
      <main lang="de" dir="ltr" className="mx-auto max-w-xl px-4 py-8 leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight">Impressum</h1>

        <h2 className={h2}>Angaben gemäß § 5 DDG</h2>
        <p className={p}>
          <mark>[TODO: Vollständiger Name bzw. Firma mit Rechtsform]</mark>
          <br />
          <mark>[TODO: Straße und Hausnummer (ladungsfähige Anschrift, kein Postfach)]</mark>
          <br />
          <mark>[TODO: PLZ und Ort]</mark>
        </p>
        <p className={p}>
          Vertreten durch: <mark>[TODO: Vertretungsberechtigte Person(en) – nur bei juristischen Personen]</mark>
        </p>

        <h2 className={h2}>Kontakt</h2>
        <p className={p}>
          E-Mail: <mark>[TODO: E-Mail-Adresse]</mark>
          <br />
          Telefon: <mark>[TODO: Telefonnummer oder weiterer schneller Kontaktweg]</mark>
        </p>

        <h2 className={h2}>Registereintrag</h2>
        <p className={p}>
          <mark>[TODO: Registergericht und Registernummer – nur falls eingetragen, sonst Abschnitt entfernen]</mark>
        </p>

        <h2 className={h2}>Umsatzsteuer-ID</h2>
        <p className={p}>
          <mark>[TODO: USt-IdNr. nach § 27a UStG – nur falls vorhanden, sonst Abschnitt entfernen]</mark>
        </p>

        <h2 className={h2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p className={p}>
          <mark>[TODO: Name und Anschrift]</mark>
        </p>

        <h2 className={h2}>Verbraucherstreitbeilegung</h2>
        <p className={p}>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen. <mark>[TODO: vom Betreiber zu prüfen (§ 36 VSBG)]</mark>
        </p>

        <h2 className={h2}>Hinweis</h2>
        <p className={p}>
          BriefKlar erklärt Behördenbriefe mithilfe künstlicher Intelligenz in einfacher Sprache. BriefKlar bietet keine
          Rechtsberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Bitte prüfen Sie Fristen und Beträge immer im
          Originalbrief und wenden Sie sich im Zweifel an eine Beratungsstelle.
        </p>
      </main>
    </>
  );
}
