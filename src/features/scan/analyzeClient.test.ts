import { afterEach, describe, expect, it, vi } from "vitest";
import { sampleAnalysis } from "@/features/result/__fixtures__/analysis";
import { analyzeLetter } from "./analyzeClient";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function mockFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn<typeof fetch>(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const photo = () => new File(["jpeg-bytes"], "brief.jpg", { type: "image/jpeg" });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("analyzeLetter", () => {
  it("posts the file and language as multipart form data", async () => {
    const fetchMock = mockFetch(async () => jsonResponse(sampleAnalysis));
    const result = await analyzeLetter(photo(), "ar");

    expect(result).toEqual({ ok: true, analysis: sampleAnalysis });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/analyze");
    expect(init?.method).toBe("POST");
    const form = init?.body as FormData;
    expect(form.get("language")).toBe("ar");
    expect((form.get("file") as File).name).toBe("brief.jpg");
  });

  it("names plain blobs by type", async () => {
    const fetchMock = mockFetch(async () => jsonResponse(sampleAnalysis));
    await analyzeLetter(new Blob(["x"], { type: "application/pdf" }), "de");
    const form = fetchMock.mock.calls[0][1]?.body as FormData;
    expect((form.get("file") as File).name).toBe("letter.pdf");
  });

  it("returns the server error code", async () => {
    mockFetch(async () => jsonResponse({ error: "not_a_letter" }, 422));
    expect(await analyzeLetter(photo(), "en")).toEqual({ ok: false, error: "not_a_letter" });
  });

  it("maps unknown error bodies by status code", async () => {
    mockFetch(async () => new Response("<html>Too Large</html>", { status: 413 }));
    expect(await analyzeLetter(photo(), "en")).toEqual({ ok: false, error: "too_large" });

    mockFetch(async () => jsonResponse({ error: "weird" }, 429));
    expect(await analyzeLetter(photo(), "en")).toEqual({ ok: false, error: "rate_limited" });

    mockFetch(async () => new Response("oops", { status: 500 }));
    expect(await analyzeLetter(photo(), "en")).toEqual({ ok: false, error: "upstream" });
  });

  it("reports network failures", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await analyzeLetter(photo(), "tr")).toEqual({ ok: false, error: "network" });
  });

  it("rejects a 200 body that does not match the contract", async () => {
    mockFetch(async () => jsonResponse({ isLetter: true, title: "x" }));
    expect(await analyzeLetter(photo(), "uk")).toEqual({ ok: false, error: "upstream" });
  });

  it("treats isLetter=false as not_a_letter", async () => {
    mockFetch(async () => jsonResponse({ ...sampleAnalysis, isLetter: false }));
    expect(await analyzeLetter(photo(), "uk")).toEqual({ ok: false, error: "not_a_letter" });
  });
});
