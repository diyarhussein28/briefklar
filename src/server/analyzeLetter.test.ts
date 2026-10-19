// @vitest-environment node
import type { Mistral } from "@mistralai/mistralai";
import { describe, expect, it, vi } from "vitest";
import type { LetterAnalysis } from "@/lib/letter";
import { AnalyzeLetterError, CHAT_MODEL, OCR_MODEL, analyzeLetter } from "./analyzeLetter";
import { SYSTEM_PROMPT } from "./prompt";

const sampleAnalysis: LetterAnalysis = {
  isLetter: true,
  transcript: "Jobcenter Berlin Mitte\nEinladung\n\nBitte kommen Sie am 03.11.2026 um 09:00 Uhr.\nBG-Nummer: 12345BG0067890",
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

const { transcript, ...explanation } = sampleAnalysis;

function mockClient(chatResponse: { finishReason: string; parsed: unknown }) {
  const process = vi.fn().mockResolvedValue({
    pages: [
      { index: 0, markdown: "Jobcenter Berlin Mitte\nEinladung\n![img-0.jpeg](img-0.jpeg)" },
      { index: 1, markdown: "Bitte kommen Sie am 03.11.2026 um 09:00 Uhr.\nBG-Nummer: 12345BG0067890" },
    ],
  });
  const parse = vi.fn().mockResolvedValue({
    choices: [{ index: 0, finishReason: chatResponse.finishReason, message: { parsed: chatResponse.parsed } }],
  });
  return { client: { ocr: { process }, chat: { parse } } as unknown as Mistral, process, parse };
}

const input = {
  bytes: Buffer.from("fake image"),
  mediaType: "image/jpeg" as const,
  language: "ar" as const,
  today: "2026-10-19",
};

describe("analyzeLetter", () => {
  it("reads the image with OCR, explains the text and keeps the OCR text as transcript", async () => {
    const { client, process, parse } = mockClient({ finishReason: "stop", parsed: explanation });

    await expect(analyzeLetter(input, client)).resolves.toEqual({ ...explanation, transcript });

    expect(process).toHaveBeenCalledWith({
      model: OCR_MODEL,
      document: { type: "image_url", imageUrl: `data:image/jpeg;base64,${Buffer.from("fake image").toString("base64")}` },
    });

    const params = parse.mock.calls[0][0];
    expect(params.model).toBe(CHAT_MODEL);
    expect(params.messages[0]).toEqual({ role: "system", content: SYSTEM_PROMPT });
    const user = params.messages[1].content;
    expect(user).toContain("2026-10-19");
    expect(user).toContain("Arabic");
    expect(user).toContain(`<letter>\n${transcript}\n</letter>`);
    expect(user).not.toContain("img-0.jpeg");
    // The model is not asked for the transcript; OCR provides it verbatim.
    expect(params.responseFormat.shape.transcript).toBeUndefined();
  });

  it("sends PDFs as a document URL", async () => {
    const { client, process } = mockClient({ finishReason: "stop", parsed: explanation });

    await analyzeLetter({ ...input, mediaType: "application/pdf" }, client);

    expect(process.mock.calls[0][0].document).toMatchObject({
      type: "document_url",
      documentUrl: expect.stringMatching(/^data:application\/pdf;base64,/),
    });
  });

  it("throws 'invalid_output' when the output was cut off", async () => {
    const { client } = mockClient({ finishReason: "length", parsed: undefined });
    await expect(analyzeLetter(input, client)).rejects.toEqual(new AnalyzeLetterError("invalid_output"));
  });

  it("throws 'invalid_output' when the JSON does not match the schema", async () => {
    const { client } = mockClient({ finishReason: "stop", parsed: { isLetter: true } });
    await expect(analyzeLetter(input, client)).rejects.toBeInstanceOf(AnalyzeLetterError);
  });
});
