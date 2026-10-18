import { z } from "zod";

/**
 * Shared contract between the /api/analyze route (server) and the UI (client).
 * The server asks Claude for exactly this shape via structured outputs.
 */

export const SENDER_TYPES = [
  "jobcenter",
  "finanzamt",
  "krankenkasse",
  "pflegekasse",
  "vermieter",
  "inkasso",
  "gericht",
  "auslaenderbehoerde",
  "familienkasse",
  "behoerde",
  "bank_versicherung",
  "arbeitgeber",
  "schule",
  "bundeswehr",
  "sonstiges",
] as const;

export const HELP_TOPICS = [
  "beratungshilfe",
  "migrationsberatung",
  "mieterverein",
  "verbraucherzentrale",
  "schuldnerberatung",
  "sozialberatung",
] as const;

export const URGENCY_LEVELS = ["red", "yellow", "green"] as const;

/** A value found in the letter, plus the exact text it was read from (for highlighting). */
const quoted = {
  /** Exact, verbatim substring of `transcript` that this value was read from. */
  quote: z.string(),
};

export const LetterAnalysisSchema = z.object({
  /** false when the upload is not a readable letter/document. All other fields may then be empty. */
  isLetter: z.boolean(),
  /** Full text of the letter in the original language, as read from the image/PDF. */
  transcript: z.string(),
  /** Name of the sending organisation or person, as written in the letter. */
  sender: z.string().nullable(),
  senderType: z.enum(SENDER_TYPES),
  /** Date printed on the letter, ISO YYYY-MM-DD. */
  letterDate: z.string().nullable(),
  /** Short title in the target language, e.g. "Einladung zum Termin beim Jobcenter". */
  title: z.string(),
  urgency: z.enum(URGENCY_LEVELS),
  /** One sentence in the target language explaining the urgency level. */
  urgencyReason: z.string(),
  /** Exactly three short sentences in the target language: what it is, what is required, by when / how much. */
  summary: z.array(z.string()),
  deadline: z
    .object({
      /** ISO YYYY-MM-DD. */
      date: z.string(),
      /** true when the date was calculated (e.g. "within 2 weeks of receipt") rather than printed. */
      isEstimated: z.boolean(),
      /** What must be done by this date, in the target language. */
      description: z.string(),
      ...quoted,
    })
    .nullable(),
  amount: z
    .object({
      value: z.number(),
      currency: z.string(),
      /** What the amount is (to pay, to receive, ...), in the target language. */
      description: z.string(),
      ...quoted,
    })
    .nullable(),
  /** Aktenzeichen / Kundennummer / BG-Nummer etc. */
  reference: z
    .object({
      value: z.string(),
      /** Label as printed, e.g. "Aktenzeichen". */
      label: z.string(),
      ...quoted,
    })
    .nullable(),
  /** General, non-personal next steps in the target language (no legal advice). */
  steps: z.array(z.string()),
  scam: z.object({
    level: z.enum(["none", "possible", "likely"]),
    /** Reasons in the target language; empty when level is "none". */
    reasons: z.array(z.string()),
  }),
  /** Which kinds of free counselling fit this letter. */
  helpTopics: z.array(z.enum(HELP_TOPICS)),
});

export type LetterAnalysis = z.infer<typeof LetterAnalysisSchema>;
export type SenderType = (typeof SENDER_TYPES)[number];
export type HelpTopic = (typeof HELP_TOPICS)[number];
export type Urgency = (typeof URGENCY_LEVELS)[number];

/** Error body returned by /api/analyze with a non-2xx status. */
export type AnalyzeError = {
  error: "no_file" | "unsupported_type" | "too_large" | "not_a_letter" | "rate_limited" | "upstream" | "refused";
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"] as const;
