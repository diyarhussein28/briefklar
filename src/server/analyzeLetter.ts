import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Language } from "@/i18n/languages";
import { ACCEPTED_TYPES, LetterAnalysisSchema, type LetterAnalysis } from "@/lib/letter";
import { SYSTEM_PROMPT, buildUserInstruction } from "./prompt";

export const MODEL = "claude-opus-5-5";

export type AcceptedType = (typeof ACCEPTED_TYPES)[number];

/** Claude answered, but not with a usable analysis. */
export class AnalyzeLetterError extends Error {
  constructor(readonly reason: "refused" | "invalid_output") {
    super(`Letter analysis failed: ${reason}`);
    this.name = "AnalyzeLetterError";
  }
}

const outputFormat = zodOutputFormat(LetterAnalysisSchema);

let defaultClient: Anthropic | undefined;

/** Created on first use so importing this module does not require ANTHROPIC_API_KEY. */
function getClient(): Anthropic {
  defaultClient ??= new Anthropic();
  return defaultClient;
}

export async function analyzeLetter(
  input: { bytes: Buffer | Uint8Array; mediaType: AcceptedType; language: Language; today: string },
  client: Anthropic = getClient(),
): Promise<LetterAnalysis> {
  const data = Buffer.from(input.bytes).toString("base64");
  const fileBlock =
    input.mediaType === "application/pdf"
      ? { type: "document" as const, source: { type: "base64" as const, media_type: input.mediaType, data } }
      : { type: "image" as const, source: { type: "base64" as const, media_type: input.mediaType, data } };

  // `create` instead of `parse`: `parse` throws on non-JSON text before we can look at
  // stop_reason, and it reads the first text block, which after a server-side fallback
  // may be the declined model's partial output.
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: [fileBlock, { type: "text", text: buildUserInstruction(input.language, input.today) }],
      },
    ],
    output_config: { effort: "medium", format: outputFormat },
  });

  if (response.stop_reason === "refusal") throw new AnalyzeLetterError("refused");
  if (response.stop_reason !== "end_turn") throw new AnalyzeLetterError("invalid_output");

  // Only the content after the last fallback boundary belongs to the model that answered.
  const lastFallback = response.content.findLastIndex((block) => block.type === "fallback");
  const text = response.content
    .slice(lastFallback + 1)
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  try {
    return outputFormat.parse(text);
  } catch {
    throw new AnalyzeLetterError("invalid_output");
  }
}
