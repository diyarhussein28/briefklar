import { describe, expect, it } from "vitest";
import { daysUntil, deadlineStatus, formatDay, formatRelativeDays, parseIsoDate, reminderDates } from "./reminders";

// Local date/time, as the browser would report it.
const today = new Date(2026, 9, 19, 23, 30); // 19 Oct 2026, late evening

describe("daysUntil", () => {
  it("counts whole calendar days regardless of time of day", () => {
    expect(daysUntil("2026-10-19", today)).toBe(0);
    expect(daysUntil("2026-10-20", today)).toBe(1);
    expect(daysUntil("2026-10-18", today)).toBe(-1);
    expect(daysUntil("2026-11-02", today)).toBe(14); // crosses the end of DST
  });
});

describe("reminderDates", () => {
  it("returns 7, 3 and 1 day before", () => {
    expect(reminderDates("2026-11-03")).toEqual(["2026-10-27", "2026-10-31", "2026-11-02"]);
  });

  it("crosses month and year boundaries", () => {
    expect(reminderDates("2027-01-02")).toEqual(["2026-12-26", "2026-12-30", "2027-01-01"]);
    expect(reminderDates("2028-03-01")).toEqual(["2028-02-23", "2028-02-27", "2028-02-29"]);
  });
});

describe("deadlineStatus", () => {
  it.each([
    ["2026-10-18", "overdue"],
    ["2026-10-19", "today"],
    ["2026-10-20", "soon"],
    ["2026-10-26", "soon"],
    ["2026-10-27", "later"],
  ] as const)("%s → %s", (date, status) => {
    expect(deadlineStatus(date, today)).toBe(status);
  });
});

describe("formatting", () => {
  it("formats the calendar date without time zone shifts", () => {
    expect(formatDay("2026-11-03", "de", { day: "numeric", month: "long", year: "numeric" })).toBe("3. November 2026");
    expect(formatDay("2026-11-03", "ar", { day: "numeric" })).toBe("3");
  });

  it("formats relative days", () => {
    expect(formatRelativeDays(0, "en")).toBe("today");
    expect(formatRelativeDays(1, "de")).toBe("morgen");
    expect(formatRelativeDays(5, "en")).toBe("in 5 days");
  });

  it("rejects malformed dates", () => {
    expect(() => parseIsoDate("03.11.2026")).toThrow();
  });
});
