import { describe, expect, it } from "vitest";
import { daysUntil, formatAmount, formatDate, parseIsoDate } from "./format";

describe("format helpers", () => {
  it("validates ISO dates", () => {
    expect(parseIsoDate("2026-11-05")).not.toBeNull();
    expect(parseIsoDate("2026-02-30")).toBeNull();
    expect(parseIsoDate("05.11.2026")).toBeNull();
  });

  it("formats dates in the UI language", () => {
    expect(formatDate("2026-11-05", "de")).toBe("Donnerstag, 5. November 2026");
    expect(formatDate("2026-11-05", "en")).toMatch(/^Thursday,? 5 November 2026$/);
    expect(formatDate("not-a-date", "en")).toBe("not-a-date");
  });

  it("counts calendar days from today", () => {
    const today = new Date(2026, 9, 30, 23, 30);
    expect(daysUntil("2026-11-05", today)).toBe(6);
    expect(daysUntil("2026-10-30", today)).toBe(0);
    expect(daysUntil("2026-10-28", today)).toBe(-2);
  });

  it("formats amounts as currency", () => {
    expect(formatAmount(120.5, "EUR", "de").replace(/\s/g, " ")).toBe("120,50 €");
    expect(formatAmount(5, "€", "de")).toBe("5 €");
  });
});
