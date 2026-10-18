import type { HelpTopic } from "@/lib/letter";
import type { HelpMessageKey } from "./messages";
import type { Bundesland } from "./postcode";

export type Organization = {
  /** German proper name, shown as-is in every language. */
  name: string;
  explanationKey: HelpMessageKey;
  /**
   * Best official finder. With a valid postcode it opens results near that postcode;
   * with null it opens the general search page.
   */
  searchUrl: (plz: string | null, bundesland: Bundesland | null) => string;
};

/** Counselling page of each state's Verbraucherzentrale (as linked from verbraucherzentrale.de/beratung). */
const VERBRAUCHERZENTRALE: Record<Bundesland, string> = {
  BW: "https://www.verbraucherzentrale-bawue.de/beratung",
  BY: "https://www.verbraucherzentrale.bayern/beratung",
  BE: "https://www.verbraucherzentrale-berlin.de/beratung",
  BB: "https://www.verbraucherzentrale-brandenburg.de/beratung",
  HB: "https://www.verbraucherzentrale-bremen.de/beratung-hb",
  HH: "https://www.vzhh.de/beratung",
  HE: "https://www.verbraucherzentrale-hessen.de/beratung",
  MV: "https://www.verbraucherzentrale-mv.eu/beratungsangebote",
  NI: "https://www.verbraucherzentrale-niedersachsen.de/beratung",
  NW: "https://www.verbraucherzentrale.nrw/beratung",
  RP: "https://www.verbraucherzentrale-rlp.de/beratung",
  SL: "https://www.verbraucherzentrale-saarland.de/verbraucherberatung-im-saarland-122164",
  SN: "https://www.verbraucherzentrale-sachsen.de/beratung",
  ST: "https://www.verbraucherzentrale-sachsen-anhalt.de/beratung",
  SH: "https://www.verbraucherzentrale.sh/beratung",
  TH: "https://www.vzth.de/beratung",
};

/** Caritas address search, restricted to the "Adressen" content type. */
const CARITAS_ADDRESSES = "74ac1d07-6f1e-4949-8169-f87bf0ef3804";

export const ORGANIZATIONS: Record<HelpTopic, Organization> = {
  beratungshilfe: {
    name: "Beratungshilfe beim Amtsgericht",
    explanationKey: "explain_beratungshilfe",
    // Orts- und Gerichtsverzeichnis of the Justizportal (run by the NRW Ministry of Justice).
    searchUrl: (plz) =>
      plz
        ? `https://www.justizadressen.nrw.de/de/justiz/gericht?ang=zivil&plzort=${plz}`
        : "https://www.justizadressen.nrw.de/de/justiz/suche",
  },
  migrationsberatung: {
    name: "Migrationsberatung (MBE) / Jugendmigrationsdienst",
    explanationKey: "explain_migrationsberatung",
    // BAMF-NAvI; typ=1.2 selects MBE (1) and Jugendmigrationsdienst (2).
    searchUrl: (plz) =>
      plz
        ? `https://bamf-navi.bamf.de/de/Themen/Beratungsstellen/?ort=${plz}&typ=1.2`
        : "https://bamf-navi.bamf.de/de/Themen/Beratungsstellen/",
  },
  mieterverein: {
    name: "Mieterverein (Deutscher Mieterbund)",
    explanationKey: "explain_mieterverein",
    searchUrl: (plz) =>
      plz ? `https://mieterbund.de/mieterverein-vor-ort/?search=${plz}` : "https://mieterbund.de/mieterverein-vor-ort/",
  },
  verbraucherzentrale: {
    name: "Verbraucherzentrale",
    explanationKey: "explain_verbraucherzentrale",
    searchUrl: (_plz, bundesland) =>
      bundesland ? VERBRAUCHERZENTRALE[bundesland] : "https://www.verbraucherzentrale.de/beratung",
  },
  schuldnerberatung: {
    name: "Schuldnerberatung",
    explanationKey: "explain_schuldnerberatung",
    // Finder of the Bundesarbeitsgemeinschaft Schuldnerberatung (BAG-SB).
    searchUrl: (plz) =>
      plz
        ? `https://www.meine-schulden.de/hilfe-finden/stellensuche?plz=${plz}`
        : "https://www.meine-schulden.de/hilfe-finden/stellensuche",
  },
  sozialberatung: {
    name: "Allgemeine Sozialberatung (Caritas)",
    explanationKey: "explain_sozialberatung",
    searchUrl: (plz) =>
      plz
        ? `https://www.caritas.de/suche?contenttypes=${CARITAS_ADDRESSES}&location=${plz}&distance=10`
        : "https://www.caritas.de/adressen",
  },
};
