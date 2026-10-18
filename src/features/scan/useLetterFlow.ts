import { useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { LetterAnalysis } from "@/lib/letter";
import { analyzeLetter, type AnalyzeFailure } from "./analyzeClient";
import { prepareUpload, type PrepareError } from "./prepareImage";

export type FlowError = PrepareError | AnalyzeFailure;

export type FlowState =
  | { phase: "idle" }
  | { phase: "analyzing" }
  | { phase: "result"; analysis: LetterAnalysis }
  | { phase: "error"; error: FlowError; retryFile: Blob | null };

/** Errors where sending the same file again can help. */
const RETRYABLE: ReadonlySet<FlowError> = new Set(["network", "upstream", "rate_limited"]);

/** idle → analyzing → result | error. Stale responses (after reset) are ignored. */
export function useLetterFlow() {
  const language = useLanguage().language ?? "de";
  const [state, setState] = useState<FlowState>({ phase: "idle" });
  const runId = useRef(0);

  async function analyze(file: Blob, id: number) {
    const result = await analyzeLetter(file, language);
    if (id !== runId.current) return;
    setState(
      result.ok
        ? { phase: "result", analysis: result.analysis }
        : { phase: "error", error: result.error, retryFile: RETRYABLE.has(result.error) ? file : null },
    );
  }

  async function submit(file: File) {
    const id = ++runId.current;
    setState({ phase: "analyzing" });
    const prepared = await prepareUpload(file);
    if (id !== runId.current) return;
    if (!prepared.ok) {
      setState({ phase: "error", error: prepared.error, retryFile: null });
      return;
    }
    await analyze(prepared.file, id);
  }

  const retryFile = state.phase === "error" ? state.retryFile : null;
  const retry = retryFile
    ? () => {
        const id = ++runId.current;
        setState({ phase: "analyzing" });
        void analyze(retryFile, id);
      }
    : null;

  function reset() {
    runId.current++;
    setState({ phase: "idle" });
  }

  return { state, submit, retry, reset };
}
