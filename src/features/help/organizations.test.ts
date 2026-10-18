import { describe, expect, it } from "vitest";
import { HELP_TOPICS } from "@/lib/letter";
import { ORGANIZATIONS } from "./organizations";
import type { Bundesland } from "./postcode";

const STATES: Bundesland[] = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];

describe("ORGANIZATIONS", () => {
  it.each(HELP_TOPICS)("%s returns https URLs with and without a postcode", (topic) => {
    const organization = ORGANIZATIONS[topic];
    expect(organization.name).not.toBe("");
    for (const url of [organization.searchUrl(null, null), organization.searchUrl("10115", "BE")]) {
      expect(new URL(url).protocol).toBe("https:");
    }
  });

  it("puts the postcode into finders that support it", () => {
    for (const topic of ["beratungshilfe", "migrationsberatung", "mieterverein", "schuldnerberatung", "sozialberatung"] as const) {
      expect(ORGANIZATIONS[topic].searchUrl("80331", "BY")).toContain("80331");
      expect(ORGANIZATIONS[topic].searchUrl(null, null)).not.toContain("80331");
    }
  });

  it("links the Verbraucherzentrale of every state, with a national fallback", () => {
    const urls = STATES.map((state) => ORGANIZATIONS.verbraucherzentrale.searchUrl("10115", state));
    expect(new Set(urls).size).toBe(16);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
    expect(ORGANIZATIONS.verbraucherzentrale.searchUrl(null, null)).toBe("https://www.verbraucherzentrale.de/beratung");
  });
});
