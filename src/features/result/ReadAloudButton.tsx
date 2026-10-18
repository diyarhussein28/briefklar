import { useEffect, useState, useSyncExternalStore, type JSX } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { resultMessages } from "./messages";

const noopSubscribe = () => () => {};
const useSpeechSupported = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    () => false,
  );

/** Best voice for a BCP 47 tag: exact match first, then same base language. */
function pickVoice(speechLang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const wanted = speechLang.toLowerCase();
  const base = wanted.split("-")[0];
  const normalized = (voice: SpeechSynthesisVoice) => voice.lang.replace("_", "-").toLowerCase();
  return (
    voices.find((voice) => normalized(voice) === wanted) ?? voices.find((voice) => normalized(voice).split("-")[0] === base)
  );
}

type Props = { sentences: string[]; speechLang: string };

/** Reads the sentences aloud with the browser's speech synthesis. Hidden when unsupported. */
export function ReadAloudButton({ sentences, speechLang }: Props): JSX.Element | null {
  const t = useT(resultMessages);
  const supported = useSpeechSupported();
  const [speaking, setSpeaking] = useState(false);

  // Stop speaking when the result is closed.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!supported) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    synth.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const voice = pickVoice(speechLang);
    // One utterance per sentence: long utterances get cut off in some browsers.
    sentences.forEach((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = speechLang;
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      if (index === sentences.length - 1) utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      synth.speak(utterance);
    });
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-blue-700 bg-white px-5 py-2 text-lg font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
    >
      {speaking ? <StopIcon /> : <SpeakerIcon />}
      {speaking ? t("stopReading") : t("readAloud")}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
