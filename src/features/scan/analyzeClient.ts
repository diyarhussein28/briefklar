import type { Language } from "@/i18n/languages";
import { LetterAnalysisSchema, type AnalyzeError, type LetterAnalysis } from "@/lib/letter";

export type AnalyzeFailure = AnalyzeError["error"] | "network";
export type AnalyzeResult = { ok: true; analysis: LetterAnalysis } | { ok: false; error: AnalyzeFailure };

const SERVER_ERRORS: readonly AnalyzeError["error"][] = [
  "no_file",
  "unsupported_type",
  "too_large",
  "not_a_letter",
  "rate_limited",
  "upstream",
];

function errorFromStatus(status: number): AnalyzeError["error"] {
  if (status === 413) return "too_large";
  if (status === 429) return "rate_limited";
  return "upstream";
}

async function readError(response: Response): Promise<AnalyzeError["error"]> {
  try {
    const body: unknown = await response.json();
    const code = (body as { error?: unknown } | null)?.error;
    if (SERVER_ERRORS.includes(code as AnalyzeError["error"])) return code as AnalyzeError["error"];
  } catch {
    // Not JSON (e.g. a proxy error page): fall back to the status code.
  }
  return errorFromStatus(response.status);
}

/** Sends the letter to /api/analyze and validates the answer against the shared contract. */
export async function analyzeLetter(file: Blob, language: Language): Promise<AnalyzeResult> {
  const form = new FormData();
  const name = file instanceof File ? file.name : file.type === "application/pdf" ? "letter.pdf" : "letter.jpg";
  form.append("file", file, name);
  form.append("language", language);

  let response: Response;
  try {
    response = await fetch("/api/analyze", { method: "POST", body: form });
  } catch {
    return { ok: false, error: "network" };
  }

  if (!response.ok) return { ok: false, error: await readError(response) };

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, error: "upstream" };
  }
  const parsed = LetterAnalysisSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "upstream" };
  if (!parsed.data.isLetter) return { ok: false, error: "not_a_letter" };
  return { ok: true, analysis: parsed.data };
}
