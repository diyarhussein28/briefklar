import { describe, expect, it } from "vitest";
import { highlightSegments } from "./highlight";

const marked = (segments: ReturnType<typeof highlightSegments>) =>
  segments.filter((s) => s.highlightId).map((s) => [s.highlightId, s.text]);

describe("highlightSegments", () => {
  it("returns the whole text as one plain segment without quotes", () => {
    expect(highlightSegments("Sehr geehrte Frau Muster", [])).toEqual([
      { text: "Sehr geehrte Frau Muster", highlightId: null },
    ]);
  });

  it("returns no segments for empty text", () => {
    expect(highlightSegments("", [{ id: "a", quote: "x" }])).toEqual([]);
  });

  it("highlights exact matches and keeps the text intact", () => {
    const text = "Bitte zahlen Sie 120,50 € bis zum 15.11.2026 an uns.";
    const segments = highlightSegments(text, [
      { id: "amount", quote: "120,50 €" },
      { id: "deadline", quote: "bis zum 15.11.2026" },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(text);
    expect(marked(segments)).toEqual([
      ["amount", "120,50 €"],
      ["deadline", "bis zum 15.11.2026"],
    ]);
  });

  it("falls back to whitespace- and case-insensitive matching", () => {
    const text = "Aktenzeichen:\n  123 / AB-45\nBitte melden Sie sich BIS ZUM 1. März.";
    const segments = highlightSegments(text, [
      { id: "reference", quote: "Aktenzeichen: 123 / AB-45" },
      { id: "deadline", quote: "bis zum 1. märz" },
    ]);
    expect(marked(segments)).toEqual([
      ["reference", "Aktenzeichen:\n  123 / AB-45"],
      ["deadline", "BIS ZUM 1. März"],
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(text);
  });

  it("folds typographic dashes and quotes", () => {
    const segments = highlightSegments("Zeitraum 01.01.–31.12.2025", [{ id: "d", quote: "01.01.-31.12.2025" }]);
    expect(marked(segments)).toEqual([["d", "01.01.–31.12.2025"]]);
  });

  it("ignores unmatched and empty quotes", () => {
    const segments = highlightSegments("Hallo Welt", [
      { id: "a", quote: "nicht vorhanden" },
      { id: "b", quote: "   " },
    ]);
    expect(segments).toEqual([{ text: "Hallo Welt", highlightId: null }]);
  });

  it("lets the shorter quote win when quotes overlap", () => {
    const text = "Zahlen Sie 50 € bis 3.4.2026.";
    const segments = highlightSegments(text, [
      { id: "deadline", quote: "Zahlen Sie 50 € bis 3.4.2026" },
      { id: "amount", quote: "50 €" },
    ]);
    expect(marked(segments)).toEqual([
      ["deadline", "Zahlen Sie "],
      ["amount", "50 €"],
      ["deadline", " bis 3.4.2026"],
    ]);
    expect(segments.map((s) => s.text).join("")).toBe(text);
  });

  it("gives identical ranges to the first quote", () => {
    const segments = highlightSegments("Frist: 2.2.2026", [
      { id: "first", quote: "2.2.2026" },
      { id: "second", quote: "2.2.2026" },
    ]);
    expect(marked(segments)).toEqual([["first", "2.2.2026"]]);
  });

  it("handles partial overlaps", () => {
    const segments = highlightSegments("abcdefgh", [
      { id: "x", quote: "abcde" },
      { id: "y", quote: "defg" },
    ]);
    expect(marked(segments)).toEqual([
      ["x", "abc"],
      ["y", "defg"],
    ]);
  });
});
