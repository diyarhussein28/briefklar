import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES } from "@/lib/letter";
import { fitWithin, prepareUpload } from "./prepareImage";

describe("prepareUpload", () => {
  it("passes PDFs through unchanged", async () => {
    const pdf = new File(["%PDF-1.7"], "brief.pdf", { type: "application/pdf" });
    expect(await prepareUpload(pdf)).toEqual({ ok: true, file: pdf });
  });

  it("rejects PDFs over the upload limit", async () => {
    const pdf = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "big.pdf", { type: "application/pdf" });
    expect(await prepareUpload(pdf)).toEqual({ ok: false, error: "too_large" });
  });

  it("rejects files that are neither images nor PDFs", async () => {
    const doc = new File(["x"], "brief.docx", { type: "application/msword" });
    expect(await prepareUpload(doc)).toEqual({ ok: false, error: "unsupported_type" });
  });
});

describe("fitWithin", () => {
  it("scales the longest side down to the limit", () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 2000, height: 1500 });
    expect(fitWithin(3024, 4032)).toEqual({ width: 1500, height: 2000 });
  });

  it("never scales up", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
});
