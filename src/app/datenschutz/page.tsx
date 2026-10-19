import type { Metadata } from "next";
import { LegalPageHeader } from "@/features/consent/LegalPageHeader";
import { WithdrawConsentButton } from "@/features/consent/WithdrawConsentButton";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
};

const h2 = "mt-10 text-xl font-semibold";
const h3 = "mt-6 text-lg font-semibold";
const p = "mt-3";
const ul = "mt-3 list-disc space-y-2 ps-6";

export default function DatenschutzPage() {
  return (
    <>
      <LegalPageHeader />
      <main lang="de" dir="ltr" className="mx-auto max-w-xl px-4 py-8 leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight">Datenschutzerklärung</h1>
        <p className={p}>
          Kurz gesagt: Ihr Brief wird nur verarbeitet, um ihn Ihnen zu erklären. Er wird nicht gespeichert und nicht zum
          Training von KI verwendet. Es gibt kein Konto, keine Cookies und kein Tracking. Fristen und Einstellungen bleiben
          auf Ihrem Gerät.
        </p>

        <h2 className={h2}>1. Verantwortlicher</h2>
        <p className={p}>
          Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p className={p}>
          <mark>[TODO: Name, Anschrift, E-Mail des Betreibers]</mark>
        </p>
        <p className={p}>
          Datenschutzbeauftragte/r: <mark>[TODO: Kontakt, falls benannt – sonst diesen Satz entfernen]</mark>
        </p>

        <h2 className={h2}>2. Welche Daten wir verarbeiten</h2>

        <h3 className={h3}>2.1 Ihr Brief (Foto oder PDF)</h3>
        <p className={p}>
          Wenn Sie einen Brief fotografieren oder hochladen, wird die Datei verschlüsselt (HTTPS) an unseren Server
          übertragen. Der Server leitet sie zusammen mit der gewählten Sprache an unseren KI-Anbieter Mistral AI weiter
          (siehe Abschnitt 4). Die KI liest den Brief und erstellt eine kurze Erklärung, die Frist, den Betrag und das
          Aktenzeichen. Das Ergebnis wird an Ihr Gerät zurückgeschickt.
        </p>
        <p className={p}>
          Die Datei wird nur im Arbeitsspeicher verarbeitet und danach verworfen. Wir speichern weder das Bild noch den
          Inhalt des Briefs oder die Erklärung auf unseren Servern und schreiben sie nicht in Protokolle.
        </p>
        <p className={p}>
          Behördenbriefe können besondere Kategorien personenbezogener Daten nach Art. 9 DSGVO enthalten, zum Beispiel
          Angaben zur Gesundheit, zu Sozialleistungen oder zum Aufenthaltsstatus, sowie Daten anderer Personen (z. B.
          Familienangehörige). Deshalb verarbeiten wir Briefe nur mit Ihrer ausdrücklichen Einwilligung, die Sie vor dem
          ersten Hochladen geben.
        </p>

        <h3 className={h3}>2.2 Gewählte Sprache</h3>
        <p className={p}>
          Die gewählte Sprache wird mit jedem Brief an den Server übermittelt, damit die Erklärung in dieser Sprache
          erstellt wird. Sie wird außerdem in Ihrem Browser gespeichert (siehe 2.4).
        </p>

        <h3 className={h3}>2.3 Technische Zugriffsdaten (Hosting)</h3>
        <p className={p}>
          Beim Aufruf der Website verarbeitet unser Hosting-Anbieter technisch notwendige Daten wie IP-Adresse,
          Zeitpunkt, aufgerufene Adresse und Browser-Typ, um die Website auszuliefern und vor Angriffen zu schützen. Der
          Inhalt Ihres Briefs ist nicht Teil dieser Daten. Speicherdauer:{" "}
          <mark>[TODO: Speicherdauer der Server-Logs laut Hosting-Anbieter, z. B. 7 Tage]</mark>
        </p>

        <h3 className={h3}>2.4 Speicherung nur auf Ihrem Gerät</h3>
        <p className={p}>
          Folgende Angaben speichert BriefKlar ausschließlich im lokalen Speicher (localStorage) Ihres Browsers. Sie werden
          nicht an uns übertragen und nicht mit anderen Daten zusammengeführt:
        </p>
        <ul className={ul}>
          <li>die gewählte Sprache,</li>
          <li>Ihre Einwilligung und deren Zeitpunkt,</li>
          <li>Fristen und Erinnerungen, die Sie selbst speichern,</li>
          <li>Ihre Postleitzahl, wenn Sie sie für die Suche nach Beratungsstellen angeben.</li>
        </ul>
        <p className={p}>
          Diese Speicherung ist für die von Ihnen gewünschten Funktionen unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
          Sie können die Daten jederzeit löschen, indem Sie die Websitedaten in Ihrem Browser löschen. Kalender-Erinnerungen
          werden als Datei für Ihren eigenen Kalender erzeugt; wir speichern sie nicht.
        </p>

        <h3 className={h3}>2.5 Was wir nicht tun</h3>
        <ul className={ul}>
          <li>kein Benutzerkonto, keine Anmeldung,</li>
          <li>keine Cookies, kein Tracking, keine Analyse- oder Werbedienste,</li>
          <li>kein Zugriff auf Bankkonten,</li>
          <li>keine Verwendung Ihrer Briefe zum Training von KI.</li>
        </ul>

        <h2 className={h2}>3. Rechtsgrundlagen</h2>
        <ul className={ul}>
          <li>
            Verarbeitung Ihres Briefs: Ihre ausdrückliche Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und – soweit
            besondere Kategorien personenbezogener Daten enthalten sind – Art. 9 Abs. 2 lit. a DSGVO.
          </li>
          <li>
            Bereitstellung der von Ihnen angeforderten Erklärung: Art. 6 Abs. 1 lit. b DSGVO (Nutzung des Dienstes).
          </li>
          <li>
            Technische Zugriffsdaten beim Hosting: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren
            und stabilen Betrieb).
          </li>
        </ul>
        <p className={p}>
          Die Nutzung ist freiwillig. Ohne Einwilligung können wir Ihren Brief nicht erklären; Ihnen entstehen dadurch
          keine weiteren Nachteile.
        </p>

        <h2 className={h2}>4. Empfänger und Auftragsverarbeiter</h2>
        <h3 className={h3}>4.1 Hosting</h3>
        <p className={p}>
          <mark>[TODO: Name und Anschrift des Hosting-Anbieters, Serverstandort, Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO]</mark>
        </p>

        <h3 className={h3}>4.2 KI-Anbieter Mistral AI</h3>
        <p className={p}>
          Zum Lesen und Erklären der Briefe nutzen wir KI-Modelle von Mistral AI über deren Programmierschnittstelle
          (API). Anbieter: Mistral AI SAS, 15 rue des Halles, 75001 Paris, Frankreich{" "}
          <mark>[TODO: Vertragspartei und Anschrift laut Nutzungsbedingungen bzw. abgeschlossenem Vertrag bestätigen]</mark>.
          Mistral AI verarbeitet die Daten als Auftragsverarbeiter auf Grundlage eines Vertrags nach Art. 28 DSGVO{" "}
          <mark>[TODO: Abschluss bzw. Geltung des Auftragsverarbeitungsvertrags (Data Processing Agreement) von Mistral AI bestätigen]</mark>.
        </p>
        <p className={p}>
          Die Verarbeitung erfolgt in zwei Schritten: Zuerst wandelt der Dienst „Mistral OCR“ das Foto oder PDF in Text
          um (Texterkennung). Anschließend erstellt ein Sprachmodell von Mistral AI aus diesem Text die Erklärung und
          ermittelt Frist, Betrag und Aktenzeichen.
        </p>
        <p className={p}>
          Nach Angaben von Mistral AI werden Daten, die an Mistral OCR übermittelt werden, nicht zum Training von
          KI-Modellen verwendet und standardmäßig nicht gespeichert (Zero Data Retention).
        </p>
        <p className={p}>
          Für die Anfragen an die Sprachmodelle haben wir in unserem Mistral-Konto die Einstellung deaktiviert, mit der
          Mistral AI diese Daten zur Verbesserung seiner Modelle verwenden dürfte („Anonymous improvement data“). Ihre
          Briefe werden daher nicht zum Training von KI-Modellen verwendet{" "}
          <mark>
            [TODO: vor dem Start bestätigen, dass im Mistral-Admin-Bereich unter „Privacy“ die Option „Anonymous
            improvement data“ ausgeschaltet ist – andernfalls ist diese Aussage und der Hinweis in der Einwilligung
            unzutreffend]
          </mark>
          . Mistral AI kann Ein- und Ausgaben der Sprachmodelle für einen begrenzten Zeitraum, etwa zur Erkennung von
          Missbrauch, speichern und löscht sie danach{" "}
          <mark>[TODO: Aufbewahrungsfrist für Daten der Sprachmodell-API laut aktuellen Mistral-Bedingungen bestätigen und eintragen]</mark>
          .
        </p>

        <h3 className={h3}>4.3 Ort der Verarbeitung</h3>
        <p className={p}>
          Mistral AI hat seinen Sitz in Frankreich und damit in der Europäischen Union. Nach eigenen Angaben speichert und
          verarbeitet Mistral AI die Daten standardmäßig in der EU <mark>[TODO: bestätigen]</mark>. Eine Übermittlung in
          ein Land außerhalb der EU bzw. des Europäischen Wirtschaftsraums (Drittland) ist daher nicht vorgesehen{" "}
          <mark>
            [TODO: prüfen, ob Mistral AI Unterauftragsverarbeiter außerhalb der EU/des EWR einsetzt; falls ja, diese
            Empfänger und die Garantien nach Art. 44 ff. DSGVO (z. B. Angemessenheitsbeschluss oder
            EU-Standardvertragsklauseln) hier nennen]
          </mark>
          .
        </p>

        <h2 className={h2}>5. Speicherdauer</h2>
        <ul className={ul}>
          <li>Brief und Erklärung: keine Speicherung bei uns; Verarbeitung nur für die Dauer der Anfrage.</li>
          <li>Beim KI-Anbieter: siehe Abschnitt 4.2.</li>
          <li>Technische Zugriffsdaten: siehe Abschnitt 2.3.</li>
          <li>Daten im Browser: bis Sie sie löschen.</li>
        </ul>

        <h2 className={h2}>6. Widerruf Ihrer Einwilligung</h2>
        <p className={p}>
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Die
          Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt. Da wir Ihre Briefe nicht speichern, gibt es
          nach dem Widerruf bei uns nichts zu löschen. Vor dem nächsten Hochladen werden Sie erneut gefragt.
        </p>
        <div className="mt-4">
          <WithdrawConsentButton />
        </div>

        <h2 className={h2}>7. Ihre Rechte</h2>
        <p className={p}>Sie haben nach der DSGVO das Recht auf</p>
        <ul className={ul}>
          <li>Auskunft (Art. 15),</li>
          <li>Berichtigung (Art. 16),</li>
          <li>Löschung (Art. 17),</li>
          <li>Einschränkung der Verarbeitung (Art. 18),</li>
          <li>Datenübertragbarkeit (Art. 20),</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21).</li>
        </ul>
        <p className={p}>
          Da wir keine Briefe und keine Konten speichern, liegen uns in der Regel keine Daten vor, die wir Ihnen zuordnen
          können. Wenden Sie sich mit Fragen an die oben genannte Adresse.
        </p>
        <p className={p}>
          Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), zum
          Beispiel bei der für uns zuständigen Behörde:{" "}
          <mark>[TODO: zuständige Landesdatenschutzbehörde mit Anschrift]</mark>
        </p>

        <h2 className={h2}>8. Hinweis zur künstlichen Intelligenz</h2>
        <p className={p}>
          Die Erklärungen in BriefKlar werden von einem KI-System (Mistral AI) erzeugt. Darauf weisen wir Sie vor
          der ersten Nutzung hin (Art. 50 KI-Verordnung, EU 2024/1689). KI kann Fehler machen.
          Prüfen Sie Datum, Betrag und Aktenzeichen immer im Originalbrief.
        </p>
        <p className={p}>
          BriefKlar erklärt Briefe in einfacher Sprache und bietet keine Rechtsberatung im Sinne des
          Rechtsdienstleistungsgesetzes (RDG). Für eine Beratung im Einzelfall verweisen wir auf kostenlose
          Beratungsstellen. Es findet keine automatisierte Entscheidung im Sinne von Art. 22 DSGVO statt.
        </p>

        <h2 className={h2}>9. Änderungen</h2>
        <p className={p}>
          Wir passen diese Datenschutzerklärung an, wenn sich der Dienst oder die Rechtslage ändert. Stand:{" "}
          <mark>[TODO: Datum]</mark>
        </p>
      </main>
    </>
  );
}
