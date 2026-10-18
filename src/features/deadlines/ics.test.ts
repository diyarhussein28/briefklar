import { describe, expect, it } from "vitest";
import { createDeadlineIcs } from "./ics";

const deadline = {
  title: "Widerspruch einlegen",
  date: "2026-12-31",
  description: "Widerspruch an das Jobcenter schicken",
  reference: "BG-12345",
  sender: "Jobcenter Köln",
};

/** Unfolds RFC 5545 line folding so long values can be matched. */
const unfold = (ics: string) => ics.replace(/\r\n[ \t]/g, "");

describe("createDeadlineIcs", () => {
  const ics = unfold(createDeadlineIcs(deadline, "en"));

  it("creates an all-day event on the deadline date", () => {
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
    expect(ics).toContain("SUMMARY:Deadline: Widerspruch einlegen");
  });

  it("includes sender and reference in the description", () => {
    expect(ics).toContain("Jobcenter Köln");
    expect(ics).toContain("Reference number: BG-12345");
  });

  it("adds three display alarms at 09:00 seven, three and one day before", () => {
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(3);
    expect(ics.match(/ACTION:DISPLAY/g)).toHaveLength(3);
    const triggers = [...ics.matchAll(/^TRIGGER:(.+)$/gm)].map((m) => m[1].trim());
    expect(triggers).toEqual(["-P6DT15H", "-P2DT15H", "-PT15H"]);
    expect(ics).toContain("DESCRIPTION:7 days left: Widerspruch einlegen");
    expect(ics).toContain("DESCRIPTION:Tomorrow is the last day: Widerspruch einlegen");
  });

  it("localises texts", () => {
    const de = unfold(createDeadlineIcs({ ...deadline, sender: null, reference: null }, "de"));
    expect(de).toContain("SUMMARY:Frist: Widerspruch einlegen");
    expect(de).toContain("DESCRIPTION:Noch 3 Tage: Widerspruch einlegen");
    expect(de).not.toContain("Nummer vom Brief");
  });

  it("throws on an invalid date", () => {
    expect(() => createDeadlineIcs({ ...deadline, date: "31.12.2026" }, "en")).toThrow();
    expect(() => createDeadlineIcs({ ...deadline, date: "2026-13-45" }, "en")).toThrow();
  });
});
