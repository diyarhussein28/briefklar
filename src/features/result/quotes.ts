import type { LetterAnalysis } from "@/lib/letter";
import type { HighlightQuote } from "./highlight";

export type QuoteId = "deadline" | "amount" | "reference" | "sender";

/** The passages of the letter that back up each key fact (the sender name is its own quote). */
export function quotesOf(analysis: LetterAnalysis): (HighlightQuote & { id: QuoteId })[] {
  const quotes: (HighlightQuote & { id: QuoteId })[] = [];
  if (analysis.deadline) quotes.push({ id: "deadline", quote: analysis.deadline.quote });
  if (analysis.amount) quotes.push({ id: "amount", quote: analysis.amount.quote });
  if (analysis.reference) quotes.push({ id: "reference", quote: analysis.reference.quote });
  if (analysis.sender) quotes.push({ id: "sender", quote: analysis.sender });
  return quotes;
}

export const quoteElementId = (id: QuoteId) => `letter-quote-${id}`;
