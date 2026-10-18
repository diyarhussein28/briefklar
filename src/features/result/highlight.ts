export type HighlightQuote = { id: string; quote: string };
export type Segment = { text: string; highlightId: string | null };

type Range = { id: string; start: number; end: number };

/** Characters that OCR / the model often swap: fold them to one form before comparing. */
function foldChar(char: string): string {
  if (/[‐-―−]/.test(char)) return "-";
  if (/[“-‟«»"]/.test(char)) return '"';
  if (/[‘-‛']/.test(char)) return "'";
  const lower = char.toLowerCase();
  // Keep the mapping 1:1 with the original text (e.g. "İ".toLowerCase() has two code units).
  return lower.length === 1 ? lower : char;
}

/**
 * Normalises text for fuzzy matching: whitespace runs become one space, case and
 * typographic quotes/dashes are folded. `map[i]` is the index in the original text
 * of normalised character `i`.
 */
function normalize(text: string): { value: string; map: number[] } {
  let value = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/\s/.test(char)) {
      if (value.length > 0 && value[value.length - 1] !== " ") {
        value += " ";
        map.push(i);
      }
      continue;
    }
    value += foldChar(char);
    map.push(i);
  }
  if (value.endsWith(" ")) {
    value = value.slice(0, -1);
    map.pop();
  }
  return { value, map };
}

function findRange(text: string, normalizedText: { value: string; map: number[] }, quote: string) {
  const trimmed = quote.trim();
  if (!trimmed) return null;

  const exact = text.indexOf(trimmed);
  if (exact !== -1) return { start: exact, end: exact + trimmed.length };

  const needle = normalize(trimmed).value;
  if (!needle) return null;
  const found = normalizedText.value.indexOf(needle);
  if (found === -1) return null;
  const start = normalizedText.map[found];
  const end = normalizedText.map[found + needle.length - 1] + 1;
  return { start, end };
}

/**
 * Splits `text` into plain and highlighted segments, one highlight per quote (first occurrence).
 * Matching: exact substring first, then whitespace-/case-insensitive. Unmatched quotes are ignored.
 * Overlaps: shorter (more specific) quotes win; a longer quote keeps the characters left over.
 */
export function highlightSegments(text: string, quotes: HighlightQuote[]): Segment[] {
  if (!text) return [];

  const normalizedText = normalize(text);
  const ranges: Range[] = [];
  for (const { id, quote } of quotes) {
    const range = findRange(text, normalizedText, quote);
    if (range) ranges.push({ id, ...range });
  }

  // Stable sort keeps input order for equally long ranges.
  ranges.sort((a, b) => a.end - a.start - (b.end - b.start));

  const owner: (string | null)[] = new Array(text.length).fill(null);
  for (const range of ranges) {
    for (let i = range.start; i < range.end; i++) {
      if (owner[i] === null) owner[i] = range.id;
    }
  }

  const segments: Segment[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || owner[i] !== owner[start]) {
      segments.push({ text: text.slice(start, i), highlightId: owner[start] });
      start = i;
    }
  }
  return segments;
}
