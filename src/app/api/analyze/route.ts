import { HTTPClientError, MistralError, SDKValidationError } from "@mistralai/mistralai/models/errors";
import { isLanguage } from "@/i18n/languages";
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, type AnalyzeError, type LetterAnalysis } from "@/lib/letter";
import { AnalyzeLetterError, analyzeLetter, type AcceptedType } from "@/server/analyzeLetter";

export const maxDuration = 60;

/** Room for the multipart boundaries and the `language` field on top of the file itself. */
const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

function fail(status: number, error: AnalyzeError["error"]): Response {
  return Response.json({ error } satisfies AnalyzeError, { status });
}

function isAcceptedType(type: string): type is AcceptedType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

/** Today's date in Germany as YYYY-MM-DD. */
function berlinToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}

/**
 * POST multipart/form-data { file, language } → LetterAnalysis, or AnalyzeError.
 * The letter is only held in memory for the duration of the request; it is never stored or logged.
 */
export async function POST(request: Request): Promise<Response> {
  if (Number(request.headers.get("content-length")) > MAX_UPLOAD_BYTES + MULTIPART_OVERHEAD_BYTES) {
    return fail(413, "too_large");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "no_file");
  }

  const file = form.get("file");
  const language = form.get("language");
  // A missing/invalid language means a malformed request; AnalyzeError has no dedicated code for it.
  if (!(file instanceof File) || file.size === 0 || !isLanguage(language)) return fail(400, "no_file");
  if (!isAcceptedType(file.type)) return fail(400, "unsupported_type");
  if (file.size > MAX_UPLOAD_BYTES) return fail(413, "too_large");

  let analysis: LetterAnalysis;
  try {
    analysis = await analyzeLetter({
      bytes: new Uint8Array(await file.arrayBuffer()),
      mediaType: file.type,
      language,
      today: berlinToday(),
    });
  } catch (error) {
    if (error instanceof AnalyzeLetterError) {
      console.error(`[analyze] ${error.reason}`);
      return fail(502, "upstream");
    }
    if (error instanceof MistralError) {
      console.error(`[analyze] Mistral API error ${error.statusCode}`);
      return error.statusCode === 429 ? fail(429, "rate_limited") : fail(502, "upstream");
    }
    if (error instanceof HTTPClientError || error instanceof SDKValidationError) {
      console.error(`[analyze] Mistral ${error.name}`);
      return fail(502, "upstream");
    }
    throw error;
  }

  if (!analysis.isLetter) return fail(422, "not_a_letter");
  return Response.json(analysis satisfies LetterAnalysis);
}
