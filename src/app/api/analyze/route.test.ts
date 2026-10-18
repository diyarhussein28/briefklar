// @vitest-environment node
import Anthropic from "@anthropic-ai/sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_UPLOAD_BYTES, type LetterAnalysis } from "@/lib/letter";
import { AnalyzeLetterError, analyzeLetter } from "@/server/analyzeLetter";
import { POST } from "./route";

vi.mock("@/server/analyzeLetter", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/server/analyzeLetter")>()),
  analyzeLetter: vi.fn(),
}));

const mockedAnalyze = vi.mocked(analyzeLetter);
const analysis = { isLetter: true, transcript: "Sehr geehrte Damen und Herren" } as LetterAnalysis;

function post(fields: { file?: File; language?: string }): Promise<Response> {
  const form = new FormData();
  if (fields.file) form.set("file", fields.file);
  if (fields.language !== undefined) form.set("language", fields.language);
  return POST(new Request("http://localhost/api/analyze", { method: "POST", body: form }));
}

const jpeg = new File([new Uint8Array([1, 2, 3])], "letter.jpg", { type: "image/jpeg" });

describe("POST /api/analyze", () => {
  beforeEach(() => {
    mockedAnalyze.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns the analysis", async () => {
    mockedAnalyze.mockResolvedValue(analysis);

    const res = await post({ file: jpeg, language: "uk" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(analysis);
    const call = mockedAnalyze.mock.calls[0][0];
    expect(call.mediaType).toBe("image/jpeg");
    expect(call.language).toBe("uk");
    expect([...call.bytes]).toEqual([1, 2, 3]);
    expect(call.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("rejects a missing file", async () => {
    const res = await post({ language: "ar" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "no_file" });
  });

  it("rejects an unknown language", async () => {
    const res = await post({ file: jpeg, language: "xx" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "no_file" });
  });

  it("rejects unsupported file types", async () => {
    const res = await post({ file: new File(["hi"], "a.txt", { type: "text/plain" }), language: "ar" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "unsupported_type" });
  });

  it("rejects files that are too large", async () => {
    const big = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "big.pdf", { type: "application/pdf" });
    const res = await post({ file: big, language: "ar" });
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "too_large" });
    expect(mockedAnalyze).not.toHaveBeenCalled();
  });

  it("maps isLetter=false to not_a_letter", async () => {
    mockedAnalyze.mockResolvedValue({ ...analysis, isLetter: false });
    const res = await post({ file: jpeg, language: "tr" });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: "not_a_letter" });
  });

  it.each([
    [new AnalyzeLetterError("refused"), 422, "refused"],
    [new AnalyzeLetterError("invalid_output"), 502, "upstream"],
    [new Anthropic.RateLimitError(429, undefined, "rate limited", new Headers()), 429, "rate_limited"],
    [new Anthropic.InternalServerError(529, undefined, "overloaded", new Headers()), 502, "upstream"],
    [new Anthropic.APIConnectionError({ message: "offline" }), 502, "upstream"],
  ])("maps %s to %i %s", async (error, status, code) => {
    mockedAnalyze.mockRejectedValue(error);
    const res = await post({ file: jpeg, language: "en" });
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ error: code });
  });
});
