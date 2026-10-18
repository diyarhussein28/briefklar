// @vitest-environment node
import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it, vi } from "vitest";
import type { LetterAnalysis } from "@/lib/letter";
import { AnalyzeLetterError, MODEL, analyzeLetter } from "./analyzeLetter";
import { SYSTEM_PROMPT } from "./prompt";

const sampleAnalysis: LetterAnalysis = {
  isLetter: true,
  transcript: "Jobcenter Berlin Mitte\nEinladung\nBitte kommen Sie am 03.11.2026 um 09:00 Uhr.\nBG-Nummer: 12345BG0067890",
  sender: "Jobcenter Berlin Mitte",
  senderType: "jobcenter",
  letterDate: "2026-10-15",
  title: "Invitation to the Jobcenter",
  urgency: "red",
  urgencyReason: "The appointment is in two weeks.",
  summary: ["This is an invitation.", "You must go to the appointment.", "The appointment is on 3 November 2026."],
  deadline: {
    date: "2026-11-03",
    isEstimated: false,
    description: "Go to the appointment",
    quote: "am 03.11.2026 um 09:00 Uhr",
  },
  amount: null,
  reference: { value: "12345BG0067890", label: "BG-Nummer", quote: "BG-Nummer: 12345BG0067890" },
  steps: ["Bring this letter and your ID."],
  scam: { level: "none", reasons: [] },
  helpTopics: ["sozialberatung"],
};

function mockClient(response: { stop_reason: string; content: unknown[] }) {
  const create = vi.fn().mockResolvedValue(response);
  return { client: { beta: { messages: { create } } } as unknown as Anthropic, create };
}

const input = {
  bytes: Buffer.from("fake image"),
  mediaType: "image/jpeg" as const,
  language: "ar" as const,
  today: "2026-10-19",
};

describe("analyzeLetter", () => {
  it("sends the image before the instruction and returns the parsed analysis", async () => {
    const { client, create } = mockClient({
      stop_reason: "end_turn",
      content: [{ type: "text", text: JSON.stringify(sampleAnalysis) }],
    });

    await expect(analyzeLetter(input, client)).resolves.toEqual(sampleAnalysis);

    const params = create.mock.calls[0][0];
    expect(params.model).toBe(MODEL);
    expect(params.fallbacks).toBe("default");
    expect(params.betas).toContain("server-side-fallback-2026-07-01");
    expect(params.output_config.effort).toBe("medium");
    expect(params.output_config.format.type).toBe("json_schema");
    expect(params.system[0].text).toBe(SYSTEM_PROMPT);
    expect(params.thinking).toBeUndefined();

    const [file, instruction] = params.messages[0].content;
    expect(file).toEqual({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: Buffer.from("fake image").toString("base64") },
    });
    expect(instruction.type).toBe("text");
    expect(instruction.text).toContain("2026-10-19");
    expect(instruction.text).toContain("Arabic");
  });

  it("sends PDFs as a document block", async () => {
    const { client, create } = mockClient({
      stop_reason: "end_turn",
      content: [{ type: "text", text: JSON.stringify(sampleAnalysis) }],
    });

    await analyzeLetter({ ...input, mediaType: "application/pdf" }, client);

    expect(create.mock.calls[0][0].messages[0].content[0]).toMatchObject({
      type: "document",
      source: { type: "base64", media_type: "application/pdf" },
    });
  });

  it("ignores output produced before a server-side fallback", async () => {
    const { client } = mockClient({
      stop_reason: "end_turn",
      content: [
        { type: "text", text: '{"isLetter": tr' },
        { type: "fallback", from: { model: MODEL }, to: { model: "other" }, trigger: { type: "refusal", category: null } },
        { type: "text", text: JSON.stringify(sampleAnalysis) },
      ],
    });

    await expect(analyzeLetter(input, client)).resolves.toEqual(sampleAnalysis);
  });

  it("throws 'refused' on a refusal", async () => {
    const { client } = mockClient({ stop_reason: "refusal", content: [{ type: "text", text: "I can't" }] });
    await expect(analyzeLetter(input, client)).rejects.toEqual(new AnalyzeLetterError("refused"));
  });

  it("throws 'invalid_output' when the output was cut off", async () => {
    const { client } = mockClient({ stop_reason: "max_tokens", content: [{ type: "text", text: '{"isLetter"' }] });
    await expect(analyzeLetter(input, client)).rejects.toEqual(new AnalyzeLetterError("invalid_output"));
  });

  it("throws 'invalid_output' when the JSON does not match the schema", async () => {
    const { client } = mockClient({ stop_reason: "end_turn", content: [{ type: "text", text: '{"isLetter": true}' }] });
    await expect(analyzeLetter(input, client)).rejects.toBeInstanceOf(AnalyzeLetterError);
  });
});
