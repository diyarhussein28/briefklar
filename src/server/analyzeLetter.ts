import { Mistral } from "@mistralai/mistralai";
import type { Language } from "@/i18n/languages";
import { ACCEPTED_TYPES, LetterAnalysisSchema, type LetterAnalysis } from "@/lib/letter";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompt";

/** Reads the photo/PDF into Markdown text. */
export const OCR_MODEL = "mistral-ocr-latest";
/** Explains the text; supports strict JSON-schema structured outputs. */
export const CHAT_MODEL = "mistral-medium-latest";

export type AcceptedType = (typeof ACCEPTED_TYPES)[number];

/** The model writes everything except the transcript, which comes verbatim from OCR. */
const ExplanationSchema = LetterAnalysisSchema.omit({ transcript: true });

/** Mistral answered, but not with a usable analysis. */
export class AnalyzeLetterError extends Error {
  constructor(readonly reason: "invalid_output") {
    super(`Letter analysis failed: ${reason}`);
    this.name = "AnalyzeLetterError";
  }
}

let defaultClient: Mistral | undefined;

/** Created on first use so importing this module does not require MISTRAL_API_KEY. */
function getClient(): Mistral {
  defaultClient ??= new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  return defaultClient;
}

/** OCR Markdown references extracted images as `![img-0.jpeg](img-0.jpeg)`; they carry no text. */
const IMAGE_REFERENCE = /!\[[^\]]*\]\([^)]*\)/g;

async function readLetterText(bytes: Uint8Array, mediaType: AcceptedType, client: Mistral): Promise<string> {
  const dataUrl = `data:${mediaType};base64,${Buffer.from(bytes).toString("base64")}`;
  const result = await client.ocr.process({
    model: OCR_MODEL,
    document:
      mediaType === "application/pdf"
        ? { type: "document_url", documentUrl: dataUrl }
        : { type: "image_url", imageUrl: dataUrl },
  });
  return result.pages
    .map((page) => page.markdown.replace(IMAGE_REFERENCE, "").trim())
    .filter(Boolean)
    .join("\n\n");
}

export async function analyzeLetter(
  input: { bytes: Buffer | Uint8Array; mediaType: AcceptedType; language: Language; today: string },
  client: Mistral = getClient(),
): Promise<LetterAnalysis> {
  const transcript = await readLetterText(input.bytes, input.mediaType, client);

  const response = await client.chat.parse({
    model: CHAT_MODEL,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessage(input.language, input.today, transcript) },
    ],
    responseFormat: ExplanationSchema,
  });

  const choice = response.choices?.[0];
  if (choice?.finishReason !== "stop") throw new AnalyzeLetterError("invalid_output");
  const explanation = ExplanationSchema.safeParse(choice.message?.parsed);
  if (!explanation.success) throw new AnalyzeLetterError("invalid_output");

  return { ...explanation.data, transcript };
}
